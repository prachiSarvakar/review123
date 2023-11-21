import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

let tvScriptLoadingPromise;

const ChartWidget = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('q');
  const onLoadScriptRef = useRef<any>();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.id = 'tradingview-widget-loading-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    );

    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      if (
        document.getElementById('tradingview_fd833') &&
        'TradingView' in window
      ) {
        new (window.TradingView as any).widget({
          autosize: true,
          symbol: search,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'light',
          style: '1',
          locale: 'en',
          enable_publishing: false,
          withdateranges: true,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          details: true,
          hotlist: true,
          container_id: 'tradingview_fd833',
        });
      }
    }
  }, [search]);

  return (
    <div
      className='tradingview-widget-container'
      style={{ height: '100%', width: '100%' }}>
      <div
        id='tradingview_fd833'
        style={{ height: 'calc(100% - 32px)', width: '100%' }}
      />
      <div className='tradingview-widget-copyright'>
        <a
          href='https://www.tradingview.com/'
          rel='noopener nofollow'
          target='_blank'>
          <span className='blue-text'>Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default ChartWidget;
