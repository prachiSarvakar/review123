import LongCall from "@/assets/images/strategies/Long_call.png";
import LongPut from "@/assets/images/strategies/Long_Put.png";
import ShortCall from "@/assets/images/strategies/Short_call.png";
import ShortPut from "@/assets/images/strategies/Short_put.png";
import CoveredCall from "@/assets/images/strategies/Covered_call.png";
import ProtectivePut from "@/assets/images/strategies/Protective_put.png";
import BullCallSpread from "@/assets/images/strategies/Bull_call_spread.png";
import BearPutSpread from "@/assets/images/strategies/Bear_put_spread.png";
import BearCallSpread from "@/assets/images/strategies/bear_call_spread.png";
import BullPutSpread from "@/assets/images/strategies/Bull_Put_spread.png";
import RatioCallSpread from "@/assets/images/strategies/ratio_call_spread.png";
import RatioPutSpread from "@/assets/images/strategies/Ratio_put_spread.png";
import LongCallCondor from "@/assets/images/strategies/Long_call_condor.png";
import LongPutCondor from "@/assets/images/strategies/Long_Put_condor.png";
import IronCondor from "@/assets/images/strategies/Iron_condor.png";
import ShortCallCondor from "@/assets/images/strategies/short_call_condor.png";
import ShortPutCondor from "@/assets/images/strategies/short_put_condor.png";
import ReverseIronCondor from "@/assets/images/strategies/Reverse_iron_condor.png";
import LongStraddle from "@/assets/images/strategies/Long_starddle.png";
import ShortStraddle from "@/assets/images/strategies/short_straddle.png";
import CoveredShortStraddle from "@/assets/images/strategies/Covered_short_straddle.png";
import LongStrangle from "@/assets/images/strategies/Long_strangle.png";
import ShortStrangle from "@/assets/images/strategies/short_strangle.png";
import CoveredShortStrangle from "@/assets/images/strategies/Covered_short_strangle.png";
import LongCallButterfly from "@/assets/images/strategies/Long_call_butterfly.png";
import LongPutButterfly from "@/assets/images/strategies/Long_call_butterfly.png";
import IronButterfly from "@/assets/images/strategies/Iron_butterfly.png";
import ShortCallButterfly from "@/assets/images/strategies/short_call_butterfly.png";
import ShortPutButterfly from "@/assets/images/strategies/short_put_butterfly.png";
import ReverseIronButterfly from "@/assets/images/strategies/reverse_Iron_butterfly.png";
import BullCallLadder from "@/assets/images/strategies/Bull_call_ladder.png";
import BullPutLadder from "@/assets/images/strategies/Bull_put_ladder.png";
import BearCallLadder from "@/assets/images/strategies/Bear_call_ladder.png";
import BearPutLadder from "@/assets/images/strategies/Bear_put_ladder.png";
import SyntheticCall from "@/assets/images/strategies/synthetic_call.png";
import SyntheticPut from "@/assets/images/strategies/synthetic_put.png";
import SyntheticLongStock from "@/assets/images/strategies/synthetic_long_stock.png";
import SyntheticShortStock from "@/assets/images/strategies/synthetic_short_stock.png";
import SyntheticLongStraddleCalls from "@/assets/images/strategies/synthetic_Long_starddle_calls.png";
import SyntheticLongStraddlePuts from "@/assets/images/strategies/synthetic_long_straddle_puts.png";
import SyntheticShortStraddleCalls from "@/assets/images/strategies/synthetic_short_straddle_calls.png";
import SyntheticShortStraddlePuts from "@/assets/images/strategies/synthetic_short_straddle_puts.png";
import Strip from "@/assets/images/strategies/strip.png";
import Strap from "@/assets/images/strategies/strap.png";
import LongGuts from "@/assets/images/strategies/Long_guts.png";
import ShortGuts from "@/assets/images/strategies/short_guts.png";
import Collar from "@/assets/images/strategies/collar.png";
import LongCombo from "@/assets/images/strategies/Long_combo.png";
import ShortCombo from "@/assets/images/strategies/short_combo.png";
import LongBox from "@/assets/images/strategies/Long_Box.png";
import CallVerticalSpread from "@/assets/images/strategies/Call_vertical_spread.png";
import PutVerticalSpread from "@/assets/images/strategies/Put_vertical_spread.png";

export const data = [
  {
    id: 1,
    name: "Long Call",
    description: [
      "Everyone's Favourite & Perfect for Beginners: The long call is a great way to get started with options trading. You can use this strategy to profit from a price increase, but capping your losses.",
      "A call option gives you the right, but not the obligation, to buy an underlying stock at Leg 1. (strike A). You can simply buy & sell a call before it expires to profit off the price change. But remember that your maximum loss is capped at the price you pay for the option. The value of the option will decay as time passes and is sensitive to change in volatility.",
      "The long call is a popular and beginner-friendly option trading strategy. It allows you to benefit from a potential price increase of an underlying stock, while also limiting your potential losses.",
      "A call option gives you the right to buy a stock at a predetermined price (strike A), but not the obligation. You can buy and sell the call option at any time before it expires to profit from a change in the stock's price. However, it's important to note that your maximum loss is limited to the price you paid for the option. The value of the option will decrease as time passes and is sensitive to changes in volatility.",
    ],
    preview:
      "The long call is a great way to get started with options trading. You can use this strategy to profit from a price increase, but capping your losses.",
    image: LongCall,
    categories: [
      {
        name: "Bullish",
        color: "success",
        icon: "icon-bull",
      },
    ],
    labels: ["Unlimited  profit", "Limited Loss"],
    alis: "",
    breakevenlist: [],
    sweetspotlist: [],
    maxprofit: "",
    maxlosslist: [],
  },
  {
    id: 2,
    name: "Long Put",
    description: [
      "The long put option is a bearish options trading strategy that allows one to profit from a decline in the price of an underlying stock. In this strategy, an investor buys a put option, which gives them the right, but not the obligation, to sell a stock at a predetermined price (strike A). If the stock price declines below the strike price, the investor can exercise the put option and sell the stock at the higher strike price, resulting in a profit. If the stock price declines below the strike price, the investor can exercise the put option and sell the stock at the higher strike price, resulting in a profit.",
      "However, if the stock price does not decline below the strike price before the put option expires, the investor will not be able to exercise the option and will lose the premium paid for the option. The maximum profit for a long put strategy is the strike price minus the price paid for the option, while the maximum loss is limited to the premium paid for the option. The value of the put option will also decrease as time passes and is sensitive to changes in volatility.",
    ],
    preview:
      "The long put option is a bearish strategy that allows an investor to profit from a decline in the price of an underlying stock by buying a put option and selling the stock at a higher strike price if the stock price falls below the breakeven point",
    image: LongPut,
    categories: [
      {
        name: "Bearish",
        color: "danger",
        icon: "icon-bear",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: ["Leg 1 minus the cost of the put"],
    sweetspotlist: ["The Stock goes down."],
    maxprofit: "Theoretically unlimited profit, if stock goes to zero",
    maxlosslist: ["Risk is limited to premium paid for the put option"],
  },
  {
    id: 3,
    name: "Short Call",
    description: [
      "A short call option is a bearish strategy in which an investor sells a call option, receiving the premium as income but also exposing themselves to potential losses if the stock price rises above the strike price, with the maximum profit being the premium received and the maximum loss being theoretically unlimited.",
      "When running this play, you want the call you sell to expire worthless i.e most investors sell out-of-the-money options.",
      "This Strategy has a low profit potential if the stock remains below Leg 1 (strike price) at expiration. However, unlimited potential risk if the stock goes up. The reason some traders run this play is that there is a high probability for success when selling very out-of-the-money options. Ensure a stop-loss plan in place if the stock price goes up.",
    ],
    preview:
      "This Strategy has a low profit potential if the stock remains below Leg 1 (strike price) at expiration. However, unlimited potential risk if the stock goes up.",
    image: ShortCall,
    categories: [
      {
        name: "Bearish",
        color: "danger",
        icon: "icon-bear",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: ["Leg 1 + premium for the call"],
    sweetspotlist: ["Large sweet spot, when stock price is at or below leg 1 (strike price) at expiration date."],
    maxprofit: "Profit is limited to premium received for selling the call",
    maxlosslist: ["Risk is theoretically unlimited, if stock keeps going above Leg 1/strike price."],
  },
  {
    id: 4,
    name: "Short Put",
    description: [
      "If the stock price declines below the strike price before the put option expires, the buyer of the option may exercise their right to sell the stock at the higher strike price.",
      "The maximum profit for a short put strategy is the premium received, while the maximum loss is limited to the difference between the strike price and the stock price, plus the premium received. The value of the put option will also increase as time passes and is sensitive to changes in volatility.",
      "It's important to note that selling a put option carries significant risk, as the investor is exposed to potential losses if the stock price declines significantly. As such, this strategy is not suitable for all investors and should be carefully considered before being implemented.",
      "The reason some traders run this play is that there is a high probability for success when selling very out-of-the-money puts. Ensure a stop-loss plan in place if the stock price goes down.",
    ],
    preview:
      "This strategy has a low profit potential if the stock remains above the Leg 1 (strike price) at expiration. However, unlimited risk if the stock goes down.",
    image: ShortPut,
    categories: [
      {
        name: "Bullish",
        color: "success",
        icon: "icon-bull",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: ["Leg 1 minus premium received for the put"],
    sweetspotlist: ["Stock price is at or above leg 1 (strike price) at expiration date."],
    maxprofit: "Profit is limited to premium received for selling the put",
    maxlosslist: ["Risk is nearly unlimited loss if stock keeps going below Leg 1/strike price."],
  },
  {
    id: 5,
    name: "Covered Call",
    description: [
      "The potential profit from a covered call strategy is the premium received plus any increase in the stock price, while the maximum loss is limited to the price paid for the stock minus the premium received. If the stock price rises above the strike price before the option expires,the investor will not be able to realize the full increase in the stock price, as they will be required to sell the stock at the strike price. However, you will still keep the premium received as profit.",
      "If the stock price does not rise above the strike price before the option expires, the investor will not be required to sell the stock and will keep both the stock and the premium received as profit. However, if the stock price declines significantly, the investor will incur a loss equal to the difference between the price paid for the stock and the current market price.",
      "A covered call strategy can be a good choice for investors who are looking to generate income from their stock holdings while also limiting their potential losses. However, it's important to carefully consider the potential risks and rewards before implementing this strategy.",
    ],
    preview:
      "A covered call is where you hold a long position in your underlying stock and sell a call option on that same stock, receiving the premium as income.",
    image: CoveredCall,
    categories: [
      {
        name: "Neutral",
        color: "orange",
        icon: "icon-natural",
      },
      {
        name: "Bullish",
        color: "success",
        icon: "icon-bull",
      },
    ],
    labels: ["Stock"],
    alis: "",
    breakevenlist: ["Current stock price minus the premium received for selling the call."],
    sweetspotlist: [
      "Depends on your objectives:",
      "Selling covered calls to earn income on your sock, then you want stock to remain as close to the strike price as possible without going above it",
      "Sell the stock while making additional profit by selling the calls, then you want the stock to rise above Leg 2 (Strike price), so calls will be assigned.",
    ],
    maxprofit:
      "Is the premium received plus any increase in the stock price. This is the profit that an investor will realize if they are able to sell the stock at a higher price than the breakeven point.",
    maxlosslist: [
      "is limited to the price paid for the stock minus the premium received. This is the loss that an investor will incur if the stock price declines significantly and they are not able to sell the stock at a higher price than the price paid.",
    ],
  },
  {
    id: 6,
    name: "Protective Put",
    description: [
      "The investor pays a premium for the put option, which gives them the right, but not the obligation, to sell the stock at a predetermined strike price (strike A).",
      "If the stock price declines significantly, the investor can exercise the put option and sell the stock at the higher strike price, limiting their potential losses. This will allow the investor to realize a profit equal to the difference between the stock price and the strike price, plus the premium paid for the put option.",
      "The value of the put option will also decrease as time passes and is sensitive to changes in volatility. A protective put strategy can be a good choice for investors who want to protect their long stock positions against potential losses, but it's important to carefully consider the potential risks and rewards before implementing this strategy.",
    ],
    preview:
      "Simple strategy to limit losses when you are bullish about a stock but want to protect the value of the stocks in case of downturn.",
    image: ProtectivePut,
    categories: [
      {
        name: "Bullish",
        color: "success",
        icon: "icon-bull",
      },
    ],
    labels: ["Stock"],
    alis: "",
    breakevenlist: ["Current stock price plus the premium paid for the put."],
    sweetspotlist: ["Stock to go Up & Put to expire worthless."],
    maxprofit: "Profit is theoretically unlimited, as you still own the stock & have not capped the upside.",
    maxlosslist: [
      "Limited Risk to the premium paid for the put option. If the stock price does not decline significantly, the investor will not exercise the put option and will lose the premium paid for the option.",
    ],
  },
  {
    id: 7,
    name: "Bull Call Spread",
    description: [
      "A bull call spread is an options trading strategy that involves buying call options on a stock while also selling the same number of call options on the same stock with a higher strike price. The strategy aims to profit from an upward price movement in the underlying stock.",
      "The goal of a bull call spread is to profit from a rise in the price of the underlying asset. The trader earns a profit if the price of the underlying asset at expiration is above the higher strike price of the short call option. The maximum profit is achieved when the underlying asset's price is equal to the higher strike price of the short call option, and the maximum loss is equal to the difference between the strike prices of the long and short call options, minus the premium received from the sale of the short call option.",
    ],
    preview:
      "A limited-risk, limited-reward bullish vertical spread. Combining a long and short call, it limits both the upside & the downside.",
    image: BullCallSpread,
    categories: [
      {
        name: "Bullish",
        color: "success",
        icon: "icon-bull",
      },
    ],
    labels: [],
    alis: "Long Call Spread, Vertical Spread",
    breakevenlist: ["Leg 1 plus net debit for spreads paid."],
    sweetspotlist: ["Stock to be at or above Leg 2 at expiration."],
    maxprofit: "Profit is limited to the difference between Leg 1 and Leg 2 minus the net debit paid.",
    maxlosslist: ["Limited Risk to the net debit paid."],
  },
  {
    id: 8,
    name: "Bear Put Spread",
    description: [
      "A bear put spread is an options trading strategy that involves purchasing put options at a specific strike price and selling the same number of put options at a lower strike price. The strategy is used when the trader expects the underlying asset to decrease in price, but wants to limit the potential loss by capping the maximum potential profit.",
      "The goal of a bear put spread is to profit from a decline in the price of the underlying asset The trader earns a profit if the price of the underlying asset at expiration is below the lower strike price of the short put option. The maximum profit is achieved when the underlying asset's price is equal to the lower strike price of the short put option, and the maximum loss is equal to the difference between the strike prices of the long and short put options, minus the premium received from the sale of the short put option.",
    ],
    preview:
      "The long put spread is when you expect a decrease in price, and involves purchasing put options at a specific strike price and selling at a lower strike price to limit the potential loss & profit.",
    image: BearPutSpread,
    categories: [
      {
        name: "Bearish",
        color: "danger",
        icon: "icon-bear",
      },
    ],
    labels: [],
    alis: "Long Put Spread, Vertical Spread",
    breakevenlist: ["Leg 2 minus the net debit for spreads paid."],
    sweetspotlist: ["Stock to be at or below Leg 1 at expiration."],
    maxprofit: "Profit is limited to the difference between Leg 1 and Leg 2 minus the net debit paid.",
    maxlosslist: ["Limited Risk to the net debit paid."],
  },
  {
    id: 9,
    name: "Bear Call Spread",
    description: [
      "A bear call spread is when the trader expects the price of the underlying security to fall It involves selling call options on the security at a certain strike price and simultaneously buying call options on the same security at a higher strike price. The trader profits if the price of the underlying security falls below the strike price of the short call option. The maximum profit for this strategy is the difference between the strike prices of the two call options, minus the premium paid for the long call option.",
      "A limited risk-reward-balanced bearish vertical spread strategy. This strategy is an alternative to buying a long Call (leg 2), selling a cheaper Call (Leg 1) helps offset the risk.This is what limits your risk but at the same time you limit your profits.",
    ],
    preview:
      "Selling call options at a certain strike price and simultaneously buying call options on the same at a higher strike price.",

    image: BearCallSpread,
    categories: [
      {
        name: "Bearish",
        color: "danger",
        icon: "icon-bear",
      },
    ],
    labels: [],
    alis: "Short Call Spread, Vertical Spread",
    breakevenlist: ["Leg 1 plus the net credit received."],
    sweetspotlist: ["stock price to be at or below the Leg1 at expiration so both options expire worthless."],
    maxprofit: "Profit is limited to the net credit received at the time of opening option.",
    maxlosslist: ["Limited Risk to difference between Leg 1 and Leg 2, minus the net credit received."],
  },
  {
    id: 10,
    name: "Bull Put Spread",
    description: [
      "A risk-reward-balanced bullish vertical spread approach. It is used when the trader expects the price of the underlying security to rise. It involves selling put options on the security at a certain strike price and simultaneously buying put options on the same security at a lower strike price. The trader profits if the price of the underlying security rises above the strike price of the short put option.",
      "The short put spreads obligates you to sell the stock at Leg 2 if the option is assigned but gives you the right to sell stock at Leg 1.",
    ],
    preview:
      "The short put spreads obligates you to sell the stock at Leg 2 if the option is assigned but gives you the right to sell stock at Leg 1.",
    image: BullPutSpread,
    categories: [
      {
        name: "bullish",
        color: "success",
        icon: "icon-bull",
      },
    ],
    labels: [],
    alis: "Short Put Spread, Vertical Spread",
    breakevenlist: ["Leg 2 minus the net credit received."],
    sweetspotlist: ["Stock price to be at or above the Leg2 at expiration, so both options expire worthless."],
    maxprofit: "Profit is limited to the net credit received at the time of opening option.",
    maxlosslist: ["Limited Risk to difference between Leg 1 and Leg 2, minus the net credit received."],
  },
  {
    id: 11,
    name: "Call Vertical Spread",
    description: [
      "This strategy is used when the trader expects the underlying security to experience a limited price movement and wants to profit from the difference in the premiums received for the short call options and the premiums paid for the long call options.",
      "This strategy allows you to purchase a call that is at-the-money or slightly out-of-the-money without paying full price. The goal is to obtain the call with Leg 1 for a credit or a very small debt by selling the two calls with Leg 2.",
      "The stock rises too much, the risk is infinite and the strategy is neutral to slightly optimistic. Although you don't want to remain exposed for too long, time is beneficial to this strategy. Ensure to have a stop-loss plan in place.",
    ],
    preview: "Slightly bullish, you want the stock to rise to Leg 2 and then stop.",
    image: RatioCallSpread,
    categories: [
      {
        name: "bullish",
        color: "success",
        icon: "icon-bull",
      },
      {
        name: "Bi-Directional",
        color: "purple",
        icon: "icon-directional",
      },
    ],
    labels: [],
    alis: "Front Spreads with Calls, Ratio Vertical Spread",
    breakevenlist: [
      "2 breakevens",
      "Leg 1 plus net debit paid to enter the option",
      "Leg 2 plus the maximum profit potential",
    ],
    sweetspotlist: ["stock price to be exactly at Leg 2 at expiration."],
    maxprofit: "Limited to the difference between Leg 1 and Leg 2 minus the net debit paid.",
    maxlosslist: [
      "Limited Risk to the debit paid for the spread if the stock price goes down",
      "Unlimited Risk if the stock price goes way up.",
    ],
  },
  {
    id: 12,
    name: "Put Vertical Spread",
    description: [
      "Involves selling a greater number of put options on a particular security than the number of put options that are purchased. This strategy is used when the trader expects the underlying security to experience a limited price movement and wants to profit from the difference in the premiums received for the short put options and the premiums paid for the long put options.The trader profits if the price of the underlying security stays within a certain range.",
      "This strategy allows you to purchase a put that is at-the-money or slightly out-of-the-money without paying full price. The goal is to obtain the put with Leg 2 for a credit or a very small debit by selling the two puts with Leg 1.",
      "The stock drops too low, the risk is infinite and the strategy is neutral to slightly bearish. Although you don't want to remain exposed for too long, time is beneficial to this strategy.Ensure to have a stop-loss plan in place.",
    ],
    preview: "Slightly bearish, you want the stock to go down to Leg 2 and then stop.",
    image: RatioPutSpread,
    categories: [
      {
        name: "Bearish",
        color: "danger",
        icon: "icon-bear",
      },
      {
        name: "Bi-Directional",
        color: "purple",
        icon: "icon-directional",
      },
    ],
    labels: [],
    alis: " Front Spreads with Puts, Ratio Vertical Spread",
    breakevenlist: [
      "2 breakevens",
      "Leg 1 plus net debit paid to enter the option",
      "Leg 2 plus the maximum profit potential",
    ],
    sweetspotlist: ["stock price to be exactly at Leg 1 at expiration."],
    maxprofit: "Limited to the difference between Leg 1 and Leg 2 minus the net debit paid.",
    maxlosslist: [
      "Limited Risk to the debit paid for the spread if the stock price goes up",
      "High Risk if the stock price goes way up.",
    ],
  },
  {
    id: 13,
    name: "Long Call Condor",
    description: [
      "A long call condor is a complex options strategy that involves buying and selling four call options with different strike prices but the same expiration date. The trader buys one call option with a low strike price, sells one call option with a slightly higher strike price, buys one call option with an even higher strike price, and sells one call option with a strike price that is even higher than that.",
      'The trader profits from the strategy if the underlying security remains within a certain price range at expiration. If the price of the security is above the highest strike price, the trader will experience a loss. If the price of the security is below the lowest strike price, the trader will also experience a loss. However, if the price of the security is within the range defined by the strike prices of the options, the trader will earn a profit. This profit potential and risk profile is why the strategy is called a "condor".',
    ],
    preview:
      "4 leg strategy that involves buying and selling call options with different strike prices to profit from a narrow trading range or a slight upward price move in the underlying security.",
    image: LongCallCondor,
    categories: [
      {
        name: "Neutral",
        color: "orange",
        icon: "icon-natural",
      },
    ],
    labels: [],
    alis: "Long Condor Spreads with Calls",
    breakevenlist: ["Leg 1 plus the net debit paid.", "Leg 4 minus the net debit paid."],
    sweetspotlist: ["Stock price is in between Leg 2 and Leg 3."],
    maxprofit:
      "Limited and is equal to the difference between the strike prices of the middle two options minus the net debit paid.",
    maxlosslist: ["Limited to net debit paid to get into this Condor Strategy."],
  },
  {
    id: 14,
    name: "Long Put Condor",
    description: [
      'A long put condor spread is a bearish options trading strategy that involves buying a put option with a low strike price, selling a put option with a higher strike price, buying a put option with an even higher strike price, and selling a put option with an even higher strike price. All of the options have the same expiration date and are typically used in a neutral market outlook. The strategy is designed to profit from a narrow trading range or a slight downward price move in the underlying security. It is called a "condor" because the profit potential and risk profile of the position resemble the shape of a condor\'s wings.',
      "The trader profits from the strategy if the underlying security remains within a certain price range at expiration. If the price of the security is above the strike price of the highest put option, the trader will experience a loss. If the price of the security is below the strike price of the lowest put option, the trader will also experience a loss. However, if the price of the security is within the range defined by the strike prices of the options, the trader will earn a profit. The maximum profit is limited and is equal to the difference between the strike prices of the middle two options minus the net debit paid to enter the position. The maximum loss is unlimited and is equal to the difference between the strike prices of the outer two options plus the net debit paid to enter the position.",
    ],
    preview:
      "Bearish options strategy that involves buying and selling four put options with different strike prices to profit from a narrow trading range or a slight downward price move in the underlying security.",
    image: LongPutCondor,
    categories: [
      {
        name: "Neutral",
        color: "orange",
        icon: "icon-natural",
      },
    ],
    labels: [],
    alis: "Long Condor spread with Puts",
    breakevenlist: ["Leg 1 plus the net debit paid.", "Leg 4 minus the net debit paid."],
    sweetspotlist: ["Stock price is in between Leg 2 and Leg 3."],
    maxprofit:
      "Limited and is equal to the difference between the strike prices of the middle two options minus the net debit paid.",
    maxlosslist: ["Limited to net debit paid to get into this Condor Strategy."],
  },
  {
    id: 15,
    name: "Iron Condor",
    description: [
      'An iron condor is an option trading strategy that involves simultaneously buying a put option and selling a call option at one strike price and selling a put option and buying a call option at a different strike price. All of the options have the same expiration date and are typically used in a neutral market outlook. The strategy is designed to profit from a narrow trading range in the underlying security. It is called a "condor" because the profit potential and risk profile of the position resemble the shape of a condor\'s wings.',
      "The trader profits from the strategy if the underlying security remains within a certain price range at expiration. If the price of the security is above the strike price of the call option or below the strike price of the put option, the trader will experience a loss. However, if the price of the security is within the range defined by the strike prices of the options, the trader will earn a profit. The maximum profit is limited and is equal to the difference between the strike prices of the call and put options minus the net debit paid to enter the position. The maximum loss is limited and is equal to the net debit paid to enter the position.",
    ],
    preview:
      "Involves simultaneously buying a put option and selling a call option at one strike price and selling a put option and buying a call option at a different strike price to profit from a narrow trading range in the underlying security.",
    image: IronCondor,
    categories: [
      {
        name: "Neutral",
        color: "orange",
        icon: "icon-natural",
      },
    ],
    labels: [],
    alis: "Short Iron Condor",
    breakevenlist: ["Leg 2 minus net credit received.", "Leg 3 plus the net debit paid."],
    sweetspotlist: ["Stock price is in between Leg 2 and Leg 3."],
    maxprofit: "Limited to the net credit received.",
    maxlosslist: ["Limited to Leg 2 minus Leg 1, minus the net credit received."],
  },
  {
    id: 16,
    name: "Short Call Condor",
    description: [
      'A short call condor is a bearish options trading strategy that involves selling a call option with a high strike price, buying a call option with a higher strike price, selling a call option with an even higher strike price, and buying a call option with an even higher strike price. All of the options have the same expiration date and are typically used in a neutral market outlook.The strategy is designed to profit from a narrow trading range or a slight downward price move in the underlying security. It is called a "condor" because the profit potential and risk profile of the position resemble the shape of a condor\'s wings.',
      "The trader profits from the strategy if the underlying security remains within a certain price range at expiration. If the price of the security is above the highest strike price, the trader will experience a loss. If the price of the security is below the lowest strike price, the trader will also experience a loss. However, if the price of the security is within the range defined by the strike prices of the options, the trader will earn a profit. The maximum profit is limited and is equal to the difference between the prices at which the options were sold and bought. The maximum loss is unlimited and is equal to the difference between the strike prices of the outer two options minus the net credit received to enter the position.",
    ],
    preview:
      "A short call condor is a bearish options strategy that involves selling and buying four call options with different strike prices to profit from a narrow trading range or a slight downward price move in the underlying security.",
    image: ShortCallCondor,
    categories: [
      {
        name: "Bi-Directional",
        color: "purple",
        icon: "icon-directional",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: [
      "Leg 2 minus net credit received to enter the option.",
      "Leg 3 plus the net credit received to enter the option.",
    ],
    sweetspotlist: ["Stock price is less than Leg 1 or more than Leg 4."],
    maxprofit: "Limited to the net credit received.",
    maxlosslist: [
      "difference between the strike prices of the outer two options minus the net credit received to enter the position.",
    ],
  },
  {
    id: 17,
    name: "Short Put Condor",
    description: [
      'A short put condor is a bullish options trading strategy that involves selling a put option with a low strike price, buying a put option with a higher strike price, selling a put option with an even higher strike price, and buying a put option with an even higher strike price. All of the options have the same expiration date and are typically used in a neutral market outlook The strategy is designed to profit from a narrow trading range or a slight upward price move in the underlying security. It is called a "condor" because the profit potential and risk profile of the position resemble the shape of a condor\'s wings.',
      "The trader profits from the strategy if the underlying security remains within a certain price range at expiration. If the price of the security is above the highest strike price, the trader will experience a loss. If the price of the security is below the lowest strike price, the trader will also experience a loss. However, if the price of the security is within the range defined by the strike prices of the options, the trader will earn a profit. The maximum profit is limited and is equal to the difference between the prices at which the options were sold and bought. The maximum loss is unlimited and is equal to the difference between the strike prices of the outer two options plus the net credit received to enter the position.",
    ],
    preview:
      "A bullish options strategy that involves selling and buying four put options with different strike prices to profit from a narrow trading range or a slight upward price move in the underlying security.",
    image: ShortPutCondor,
    categories: [
      {
        name: "Bi-Directional",
        color: "purple",
        icon: "icon-directional",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: [
      "Leg 2 minus net credit received to enter the option.",
      "Leg 3 plus the net credit received to enter the option.",
    ],
    sweetspotlist: ["Stock price is less than Leg 1 or more than Leg 4."],
    maxprofit: "Limited to the net credit received.",
    maxlosslist: [
      "difference between the strike prices of the outer two options minus the net credit received to enter the position.",
    ],
  },
  {
    id: 18,
    name: "Reverse Iron Condor",
    description: [
      'A reverse iron condor is a complex options trading strategy that involves simultaneously selling a put option and buying a call option at one strike price and buying a put option and selling a call option at a different strike price. All of the options have the same expiration date and are typically used in a neutral market outlook. The strategy is designed to profit from a wider trading range in the underlying security. It is called a "reverse iron condor" because it is the opposite of an iron condor and involves selling options rather than buying them.',
      "The trader profits from the strategy if the underlying security remains outside of a certain  price range at expiration. If the price of the security is within the range defined by the strike prices of the options, the trader will experience a loss. However, if the price of the security is outside of this range, the trader will earn a profit. The maximum profit is limited and is equal to the difference between the prices at which the options were sold and bought.The maximum loss is limited and is equal to the difference between the strike prices of the inner two options minus the net credit received to enter the position.",
    ],
    preview:
      "Involves simultaneously selling a put option and buying a call option at one strike price and buying a put option and selling a call option at a different strike price to profit from a wider trading range in the underlying security.",
    image: ReverseIronCondor,
    categories: [
      {
        name: "Bi-Directional",
        color: "purple",
        icon: "icon-directional",
      },
    ],
    labels: [],
    alis: "Inverse Iron Condor",
    breakevenlist: [
      "Leg 2 plus net debit received to enter the option.",
      "Leg 3 plus the net credit received to enter the option.",
    ],
    sweetspotlist: ["Stock price is less than Leg 1 or more than Leg 4."],
    maxprofit:
      "Limited and is equal to the difference between the strike prices of the middle two options minus the net debit paid.",
    maxlosslist: ["Limited to net debit paid to get into this Condor Strategy."],
  },
  {
    id: 19,
    name: "Long Straddle",
    description: [
      "A long straddle is an option strategy that involves simultaneously buying a call option and a put option on the same underlying security with the same strike price and expiration date.The strategy is designed to profit from a significant price move in either direction and is typically used in a neutral market outlook.",
      "The trader profits from the strategy if the price of the underlying security moves significantly away from the strike price in either direction before expiration. If the price of the security remains close to the strike price at expiration, both the call option and the put option expire worthless and the trader suffers a loss equal to the net debit paid to enter the position. The maximum profit is unlimited in both directions and is equal to the difference between the price of the underlying security and the strike price at expiration. The maximum loss is limited and is equal to the net debit paid to enter the position.",
    ],
    preview:
      "Simultaneously buying a call option and a put option on the same underlying security with the same strike price and expiration date to profit from a significant price move in either direction.",
    image: LongStraddle,
    categories: [
      {
        name: "Bi-Directional",
        color: "purple",
        icon: "icon-directional",
      },
    ],
    labels: ["Swing"],
    alis: "",
    breakevenlist: ["Leg 1 plus net debit paid.", "Leg 1 minus net debit paid."],
    sweetspotlist: ["Stock price goes way up or way down."],
    maxprofit:
      "Unlimited theoretically if stock goes up or if stock goes down limited to leg price minus the net debit paid.",
    maxlosslist: ["Limited to net debit paid."],
  },
  {
    id: 20,
    name: "Short Straddle",
    description: [
      "A short straddle is a options strategy that involves simultaneously selling a call option and a put option on the same underlying security with the same strike price and expiration date.The strategy is designed to profit from a lack of significant price movement in either direction and is typically used in a neutral market outlook.",
      "The trader profits from the strategy if the price of the underlying security remains close to the strike price at expiration. If the price of the security moves significantly away from the strike price in either direction before expiration, both the call option and the put option will be.",
    ],
    preview:
      "Simultaneously selling a call option and a put option on the same underlying security with the same strike price and expiration date to profit from a lack of significant price movement in either direction.",
    image: ShortStraddle,
    categories: [
      {
        name: "Neutral",
        color: "orange",
        icon: "icon-natural",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: ["Leg 1 minus net credit received.", "Leg 1 plus net credit received."],
    sweetspotlist: ["Stock price exactly at strike price (Leg 1)."],
    maxprofit: "Limited to net credit received.",
    maxlosslist: [
      "Unlimited theoretically if stock goes up or if stock goes down limited to leg price minus the net credit received.",
    ],
  },
  {
    id: 21,
    name: "Covered Short Straddle",
    description: [
      "A covered short straddle is a complex options strategy that involves simultaneously selling a call option and a put option on the same underlying security with the same strike price and expiration date, while also holding a long position in the underlying security. The strategy is designed to profit from a lack of significant price movement in either direction and is typically used in a neutral market outlook.",
      "The trader profits from the strategy if the price of the underlying security remains close to the strike price at expiration. If the price of the security moves significantly away from the strike price in either direction before expiration, one of the options will be exercised and the trader will suffer a loss. However, the long position in the underlying security helps to offset the loss. The maximum profit is limited and is equal to the net credit received to enter the position. The maximum loss is limited and is equal to the difference between the price of the underlying security and the strike price at expiration.",
    ],
    preview:
      "A risky income strategy, which involves simultaneously selling a call option and a put option on the same underlying security with the same strike price and expiration date while holding a long position in the underlying security to profit from a lack of significant price movement in either direction.",
    image: CoveredShortStraddle,
    categories: [
      {
        name: "Bullish",
        color: "success",
        icon: "icon-bull",
      },
    ],
    labels: ["Stock"],
    alis: "",
    breakevenlist: [],
    sweetspotlist: [],
    maxprofit: "",
    maxlosslist: [],
  },
  {
    id: 22,
    name: "Long Strangle",
    description: [
      "A long strangle is an option strategy that involves buying a call option and a put option on the same underlying security with different strike prices and the same expiration date. The strategy is designed to profit from a significant price move in either direction and is typically used in a neutral market outlook.",
      "The trader profits from the strategy if the price of the underlying security moves significantly away from the strike prices of the options in either direction before expiration. If the price of the security remains close to the strike prices at expiration, both the call option and the put option expire worthless and the trader suffers a loss equal to the net debit paid to enter the position.",
    ],
    preview:
      "buying a call option and a put option on the same underlying security with different strike prices and the same expiration date to profit from a significant price move in either direction.",
    image: LongStrangle,
    categories: [
      {
        name: "Bi-Directiona",
        color: "purple",
        icon: "icon-directional",
      },
    ],
    labels: ["Swing"],
    alis: "",
    breakevenlist: ["Leg 1 minus the net debit.", "Leg 2 plus the net debit"],
    sweetspotlist: ["Stock goes all the way up or all the way down"],
    maxprofit:
      "The maximum profit is unlimited in both directions and is equal to the difference between the price of the underlying security and the strike price of the options at expiration.",
    maxlosslist: ["Limited to net debit paid."],
  },
  {
    id: 23,
    name: "Short Strangle",
    description: [
      "A short strangle is a options strategy that involves simultaneously selling a call option and a put option on the same underlying security with different strike prices and the sam expiration date. The strategy is designed to profit from a lack of significant price movement in either direction and is typically used in a neutral market outlook.",
      "The trader profits from the strategy if the price of the underlying security remains close to the strike prices at expiration. If the price of the security moves significantly away from the strike prices in either direction before expiration, both the call option and the put option will be exercised and the trader will suffer a loss. The maximum profit is limited and is equal to the net credit received to enter the position. The maximum loss is unlimited in both directions and is equal to the difference between the price of the underlying security and the strike price of the options at expiration.",
    ],
    preview:
      "selling a call option and a put option on the same underlying security with different strike prices and the same expiration date to profit from a lack of significant price movement in either direction.",
    image: ShortStrangle,
    categories: [
      {
        name: "Neutral",
        color: "orange",
        icon: "icon-natural",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: ["Leg 1 minus the net credit.", "Leg 2 plus the net credit"],
    sweetspotlist: [" Stock at or between Leg 1 & Leg 2."],
    maxprofit: "Limited to net Credit received.",
    maxlosslist: [
      "The maximum loss is unlimited in both directions and its stock goes down, then limited to Leg 1 minus the net credit received.",
    ],
  },
  {
    id: 24,
    name: "Covered Short Strangle",
    description: [
      "A covered short strangle is a complex options strategy that involves simultaneously selling a call option and a put option on the same underlying security with different strike prices and the same expiration date, while also holding a long position in the underlying security. The strategy is designed to profit from a lack of significant price movement in either direction and is typically used in a neutral market outlook.",
      "The trader profits from the strategy if the price of the underlying security remains close to the strike prices at expiration. If the price of the security moves significantly away from the strike prices in either direction before expiration, one of the options will be exercised and the trader will suffer a loss. However, the long position in the underlying security helps to offset the loss. The maximum profit is limited and is equal to the net credit received to enter the position. The maximum loss is limited and is equal to the difference between the price of the underlying security and the strike price of the options at expiration.",
    ],
    preview:
      "A risky income tactic that involves selling an out-of-the-money put to generate extra income while increasing the yield of a covered call. It is comparable to a covered straddle but poses less risk.",
    image: CoveredShortStrangle,
    categories: [
      {
        name: "Bullish",
        color: "success",
        icon: "icon-bull",
      },
    ],
    labels: ["Stock"],
    alis: "",
    breakevenlist: [],
    sweetspotlist: [],
    maxprofit: "",
    maxlosslist: [],
  },
  {
    id: 25,
    name: "Long Call Butterfly",
    description: [
      "A long call butterfly is a complex options strategy that involves simultaneously buying call options at three different strike prices, with the middle strike being higher than the lowest and highest strikes. The options have the same expiration date and are typically used in a neutral market outlook. The strategy is designed to profit from a narrow trading range in the underlying security.",
      "The trader profits from the strategy if the price of the underlying security remains within a certain price range at expiration. If the price of the security is outside of this range, the trader will experience a loss.",
    ],
    preview:
      "A bull call spread and a bear call spread are combined to form a call butterfly spread. This results in an inexpensive, neutral method with a favourable risk/reward ratio.",
    image: LongCallButterfly,
    categories: [
      {
        name: "Neutral",
        color: "orange",
        icon: "icon-natural",
      },
    ],
    labels: [],
    alis: " Long Butterfly spreads with calls",
    breakevenlist: ["Leg 1 plus the net debit paid", "Leg 3 minus the net debit paid"],
    sweetspotlist: [" Stock price to be exactly at Leg 2."],
    maxprofit: "Limited to Leg 2 minus Leg 1 minus the net debit paid",
    maxlosslist: ["Limited to the net debit paid"],
  },
  {
    id: 26,
    name: "Long Put Butterfly",
    description: [
      "A long put butterfly is a complex options strategy that involves simultaneously buying put options at three different strike prices, with the middle strike being lower than the lowest and highest strikes. The options have the same expiration date and are typically used in a neutral market outlook. The strategy is designed to profit from a narrow trading range in the underlying security.",
      "The trader profits from the strategy if the price of the underlying security remains within a certain price range at expiration. If the price of the security is outside of this range, the trader will experience a loss. The maximum profit is limited and is equal to the difference between the prices at which the options were bought and sold. The maximum loss is limited and is equal to the net debit paid to enter the position.",
    ],
    preview:
      "A bull put spread and a bear put spread are combined to form a put butterfly spread. This results in an inexpensive, neutral method with a favourable risk/reward ratio.",
    image: LongPutButterfly,
    categories: [
      {
        name: "Neutral",
        color: "orange",
        icon: "icon-natural",
      },
    ],
    labels: [],
    alis: "Long Butterfly spread with Puts",
    breakevenlist: ["Leg 1 plus the net debit paid.", "Leg 3 minus the net debit paid."],
    sweetspotlist: ["Stock price to be exactly at Leg 2."],
    maxprofit: "Limited to Leg 3 minus Leg 2 minus the net debit paid",
    maxlosslist: ["Limited to the net debit paid."],
  },
  {
    id: 27,
    name: "Iron Butterfly",
    description: [
      "Strategy Involves simultaneously selling a put option and a call option at one strike price, buying a put option and a call option at a higher strike price, and selling a put option and a call option at an even higher strike price. All of the options have the same expiration date and are typically used in a neutral market outlook. The strategy is designed to profit from a narrow trading range in the underlying security.",
      "The trader profits from the strategy if the price of the underlying security remains within a certain price range at expiration. If the price of the security is outside of this range, the trader will experience a loss.",
    ],
    preview:
      "Similar to a put or call butterfly, an iron butterfly is established as a net credit instead. It consists of a bull put spread and a bear call spread combined.",
    image: IronButterfly,
    categories: [
      {
        name: "Neutral",
        color: "orange",
        icon: "icon-natural",
      },
    ],
    labels: [],
    alis: "Short Iron Butterfly",
    breakevenlist: ["Leg 2 plus the net credit received.", "Leg 2 minus the net credit received."],
    sweetspotlist: ["Stock price to be exactly at Leg 2."],
    maxprofit: "Limited to net credit received",
    maxlosslist: ["Limited to Leg 2 minus Leg 1, minus the net credit received."],
  },
  {
    id: 28,
    name: "Short Call Butterfly",
    description: [
      "A short call butterfly is a complex options strategy that involves simultaneously selling call options at three different strike prices, with the middle strike being higher than the lowest and highest strikes. The options have the same expiration date and are typically used in a neutral market outlook. The strategy is designed to profit from a narrow trading range in the underlying security.",
      "The trader profits from the strategy if the price of the underlying security remains within a certain price range at expiration. If the price of the security is outside of this range, the trader will experience a loss.",
    ],
    preview:
      "If there is a significant shift in either direction, the volatility strategy known as a short call butterfly can be beneficial. It stands in contrast to a long-call butterfly.",
    image: ShortCallButterfly,
    categories: [
      {
        name: "Bi-Directional",
        color: "purple",
        icon: "icon-directional",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: ["Leg 1 minus the net credit received.", "Leg 3 plus the net credit received."],
    sweetspotlist: ["stock price to be less than Leg 1 or more than Leg 3."],
    maxprofit: "limited to the net credit received",
    maxlosslist: [
      "limited and is equal to the difference between the prices at which the options were sold and bought.",
    ],
  },
  {
    id: 29,
    name: "Short Put Butterfly",
    description: [
      "This Strategy involves simultaneously selling put options at three different strike prices, with the middle strike being higher than the lowest and highest strikes. The options have the same expiration date and are typically used in a neutral market outlook. The strategy is designed to profit from a narrow trading range in the underlying security.",
      "The trader profits from the strategy if the price of the underlying security remains within a certain price range at expiration. If the price of the security is outside of this range, the trader will experience a loss.",
    ],
    preview:
      "If there is a significant swing in either direction, the volatility strategy known as a short put butterfly may prove profitable. In contrast to a long put butterfly.",
    image: ShortPutButterfly,
    categories: [
      {
        name: "Bi-Directional",
        color: "purple",
        icon: "icon-directional",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: ["Leg 1 minus the net credit received.", "Leg 3 plus the net credit received."],
    sweetspotlist: ["stock price to be less than Leg 1 or more than Leg 3."],
    maxprofit: "is limited and is equal to the net credit received to enter the position.",
    maxlosslist: [
      "is limited and is equal to the difference between the prices at which the options were sold and bought.",
    ],
  },
  {
    id: 30,
    name: "Reverse Iron Butterfly",
    description: [
      "This Strategy involves simultaneously selling a call option and a put option at one strike price, buying a call option and a put option at a lower strike price, and selling a call option and a put option at an even lower strike price. All of the options have the same expiration date and are typically used in a neutral market outlook. The strategy is designed to profit from a narrow trading range in the underlying security.",
      "The trader profits from the strategy if the price of the underlying security remains within a certain price range at expiration. If the price of the security is outside of this range, the trader will experience a loss.",
    ],
    preview: "",
    image: ReverseIronButterfly,
    categories: [
      {
        name: "Bi-Directional",
        color: "purple",
        icon: "icon-directional",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: ["Leg 2 plus the net debit.", "Leg 2 minus the net debit."],
    sweetspotlist: ["Stock price to be less than Leg 1 or more than Leg 4."],
    maxprofit:
      "is limited and is equal to the difference between the prices at which the options were sold and bought.",
    maxlosslist: [" is limited to net debit entered for this strategy."],
  },
  {
    id: 31,
    name: "Bull Call Ladder",
    description: [
      "involves purchasing call options at three different strike prices. This strategy is designed to profit from a rise in the underlying stock price. The maximum profit potential is increased, but limitless danger is also introduced. Although the strategy's name suggests otherwise, it is actually neutral to slightly optimistic because it has uncapped losses in the event of a significant upward movement.",
      'The trader purchases a call option with a low strike price and also purchases a call option with a higher strike price, while selling a call option with an even higher strike price (this is known as a "call spread"). The trader is betting that the underlying stock price will rise, and profits from the strategy if the stock price goes up.',
    ],
    preview: "The bull call spread is expanded by a bull call ladder, which now also contains a short call.",
    image: BullCallLadder,
    categories: [
      {
        name: "Bullish",
        color: "success",
        icon: "icon-bull",
      },
      {
        name: "Neutral",
        color: "orange",
        icon: "icon-natural",
      },
    ],
    labels: [],
    alis: "Long Call Ladder",
    breakevenlist: ["Leg 1 plus the net debit.", "Leg 3 minus the net debit."],
    sweetspotlist: ["Stock price to be at Leg 2."],
    maxprofit:
      "limited to the difference between the strike prices of the two long call options, minus the premium paid for the options.",
    maxlosslist: ["is unlimited if the stock goes way up."],
  },
  {
    id: 32,
    name: "Bull Put Ladder",
    description: [
      'Involves selling put options at three different strike prices. The trader sells a put option with a high strike price and also sells a put option with a lower strike price, while buying a put option with an even lower strike price (this is known as a "put spread"). The trader is betting that the underlying stock price will rise, and profits from the strategy if the stock price goes up.',
      "The bull put ladder is a limited risk, limited reward strategy, because the potential profit is limited to the difference between the strike prices of the short put options, minus the initial premium received for selling the options. If the stock price doesn't rise as expected, the trader may be assigned and required to buy the stock at the higher strike price of the short put options. However, if the stock price rises, the trader can profit by buying back the short put options at a lower price, or by allowing them to expire worthless. It can be an effective way to profit from a bullish market with limited capital, but it's important to understand the risks and limitations of this strategy.",
      "For this method to be successful, there must be a lot of volatility. Time is detrimental when a position is unprofitable but advantageous when it is profitable.",
    ],
    preview:
      "The bull put spread is expanded by a bull put ladder, which now contains a second long put.Although the strategy's name suggests it is bullish, it is actually very bearish or bullish because its upward gain is capped and its downside gain is practically infinite.",
    image: BullPutLadder,
    categories: [
      {
        name: "Bi-Directional",
        color: "purple",
        icon: "icon-directional",
      },
    ],
    labels: [],
    alis: "Short Put Ladder",
    breakevenlist: ["Leg 1 minus the net credit received.", "Leg 3 minus the net credit received."],
    sweetspotlist: ["Stock price goes way lower."],
    maxprofit:
      "limited to the difference between the strike prices of the two short put options,minus the premium received for selling the options.",
    maxlosslist: [
      "is limited to the difference between the strike prices of the two long put options, plus the premium received for selling the options.",
    ],
  },
  {
    id: 33,
    name: "Bear Call Ladder",
    description: [
      'Involves selling call options at three different strike prices. The trader sells a call option with a high strike price and also sells a call option with a lower strike price, while buying a call option with an even lower strike price (this is known as a "call spread"). The trader is betting that the underlying stock price will decline, and profits from the strategy if the stock price goes down.',
      "The bear call ladder is a limited risk, limited reward strategy, because the potential profit is limited to the difference between the strike prices of the short call options, plus the initial premium received for selling the options. If the stock price doesn't decline as expected, the trader may be assigned and required to sell the stock at the lower strike price of the short call options. However, if the stock price declines, the trader can profit by buying back the short call options at a lower price, or by allowing them to expire worthless. It can be an effective way to profit from a bearish market with limited capital, but it's important to understand the risks and limitations of this strategy.",
      "For this method to be successful, there must be a lot of volatility. Time is detrimental when a position is unprofitable but advantageous when it is profitable.",
    ],
    preview:
      "The bear call spread is expanded by a bear call ladder since it now includes a second long call. Although the strategy's name would lead one to believe otherwise, it is actually either very bullish or bearish because it has a limited downside gain and an unlimited upward gain.",
    image: BearCallLadder,
    categories: [
      {
        name: "Bi-Directional",
        color: "purple",
        icon: "icon-directional",
      },
    ],
    labels: [],
    alis: "Short Call Ladder",
    breakevenlist: ["Leg 1 plus the net credit received.", "Leg 3 plus the net credit received."],
    sweetspotlist: ["Stock price goes way up."],
    maxprofit:
      "limited to the difference between the strike prices of the two short call options,plus the premium received for selling the options.",
    maxlosslist: [
      "limited to the difference between the strike prices of the two long call options,minus the premium received for selling the options.",
    ],
  },
  {
    id: 34,
    name: "Bear Put Ladder",
    description: [
      'Involves selling put options at three different strike prices. The trader sells a put option with a low strike price and also sells a put option with a higher strike price, while buying a put option with an even higher strike price (this is known as a "put spread"). The trader is betting that the underlying stock price will decline, and profits from the strategy if the stock price goes down.',
      "The bear put ladder is a limited risk, limited reward strategy, because the potential profit is limited to the difference between the strike prices of the short put options, plus the initial premium received for selling the options. If the stock price doesn't decline as expected, the trader may be assigned and required to sell the stock at the lower strike price of the short put options. However, if the stock price declines, the trader can profit by buying back the short put options at a higher price, or by allowing them to expire worthless. It can be an effective way to profit from a bearish market with limited capital, but it's important to understand the risks and limitations of this strategy.",
      "When the position is profitable, time is beneficial; when it is not, time is detrimental. Reduced volatility helps and improves the likelihood of remaining in the profitable zone.",
    ],
    preview:
      "The bear put spread is expanded by a bear put ladder, which now contains a second short put. Although the strategy's name might lead one to believe otherwise given its practically limitless downside loss, it is actually neutral to slightly bearish.",
    image: BearPutLadder,
    categories: [
      {
        name: "Neutral",
        color: "orange",
        icon: "icon-natural",
      },
    ],
    labels: [],
    alis: "Long Put Ladder",
    breakevenlist: ["Leg 1 minus the net debit.", "Leg 3 minus the net debit."],
    sweetspotlist: ["Stock price at Leg 2."],
    maxprofit:
      "limited to the difference between the strike prices of the two short put options,plus the premium received for selling the options.",
    maxlosslist: [
      "limited to the difference between the strike prices of the two long put options,minus the premium received for selling the options.",
    ],
  },
  {
    id: 35,
    name: "Synthetic Call",
    description: [
      "The put option has a strike price that is below the current market price of the underlying asset, while the call option has a strike price that is above the current market price. When the underlying asset increases in value, the put option decreases in value, while the call option increases in value. If the underlying asset decreases in value, the put option increases in value, while the call option decreases in value.",
      "The synthetic call can be used to hedge against the risk of a decline in the price of the underlying asset, or to speculate on the possibility of the underlying asset increasing in value. It can also be used to create more complex option strategies, such as a collar, which involves buying a put option and selling a call option to create a protective floor and ceiling for the underlying asset.",
    ],
    preview:
      "A synthetic call is a financial derivative that combines a put option and a call option to replicate the payout of a traditional call option.",
    image: SyntheticCall,
    categories: [
      {
        name: "Bullish",
        color: "success",
        icon: "icon-bull",
      },
    ],
    labels: ["Stock"],
    alis: "",
    breakevenlist: [
      "Strike price of put option plus premium paid for put option (minus premium received for call option)",
    ],
    sweetspotlist: ["Stock price goes Up."],
    maxprofit:
      "difference between the strike price of the call option and the breakeven point,minus the premium paid for the put option.",
    maxlosslist: [
      "limited to the premium paid for the put option. This loss occurs if the price of the underlying asset is above the strike price of the call option at expiration.",
    ],
  },
  {
    id: 36,
    name: "Synthetic Put",
    description: [
      "The call option has a strike price that is below the current market price of the underlying asset, while the short position in the underlying asset is essentially a bet that the asset will decrease in value. When the underlying asset increases in value, the call option decreases in value, while the short position in the underlying asset results in a loss. If the underlying asset decreases in value, the call option increases in value, while the short position results in a gain.",
      "The synthetic put can be used to hedge against the risk of a decline in the price of the underlying asset, or to speculate on the possibility of the underlying asset decreasing in value. It can also be used to create more complex option strategies, such as a reverse collar,which involves selling a put option and buying a call option to create a protective floor and ceiling for the underlying asset. Synthetic puts can be used in a variety of financial markets,including stocks, bonds, commodities, and currencies. They are often used by investors and traders to manage risk and to take advantage of market movements.",
    ],
    preview:
      "A synthetic put is a financial derivative that combines a call option and a short position in the underlying asset to replicate the payout of a traditional put option.",
    image: SyntheticPut,
    categories: [
      {
        name: "Bearish",
        color: "danger",
        icon: "icon-bear",
      },
    ],
    labels: ["Stock"],
    alis: "",
    breakevenlist: [
      "Strike price of call option minus premium received for call option (plus premium paid for put option)",
    ],
    sweetspotlist: ["Stock price goes down."],
    maxprofit:
      "difference between the strike price of the call option and the market price of the underlying asset at expiration, minus the premium paid for the put option.",
    maxlosslist: [
      "limited to the premium received for the call option plus the difference between the strike price of the call option and the market price of the underlying asset.",
    ],
  },
  {
    id: 37,
    name: "Synthetic Long Stock",
    description: [
      "Synthetic long stock is a financial instrument that allows an investor to gain exposure to the price movements of a particular stock without actually owning the stock. This can be achieved through the use of derivatives such as options contracts. An investor who is synthetically long a stock will typically hold a long call option and a short put option on that stock with the same expiration date and strike price.",
      "The net effect of this position is similar to owning the stock itself, as the investor will profit if the stock price increases and will incur a loss if the stock price decreases. However, the investor does not actually own the stock and therefore does not have voting rights or receive dividends. Additionally, the investor's potential profit and loss are limited by the strike prices of the options, whereas owning the stock directly allows for unlimited profit potential.Synthetic long stock can be a useful tool for investors who want to gain exposure to the stock market without committing a large amount of capital upfront.",
    ],
    preview: "Gain exposure to the price movements of a particular stock without actually owning the stock.",
    image: SyntheticLongStock,
    categories: [
      {
        name: "Bullish",
        color: "success",
        icon: "icon-bull",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: ["the strike price of the options plus the premium received for selling the put option."],
    sweetspotlist: ["Stock price goes Up."],
    maxprofit:
      "unlimited, as the value of the position will increase with no upper bound as the underlying stock price increases.",
    maxlosslist: [
      "The potential loss is substantial, but is limited to the strike price of the options minus the net credit received.",
    ],
  },
  {
    id: 38,
    name: "Synthetic Short Stock",
    description: [
      "An investor who is synthetically short a stock will typically hold a short call option and a long put option on that stock with the same expiration date and strike price.",
      "The net effect of this position is similar to shorting the stock itself, as the investor will profit if the stock price decreases and will incur a loss if the stock price increases. However, the investor does not actually borrow and sell the stock, and therefore does not have to worry about the potential difficulty and cost of locating shares to borrow. Additionally, the investor's potential profit and loss are limited by the strike prices of the options, whereas shorting the stock directly allows for unlimited profit potential. Synthetic short stock can be a useful tool for investors who want to speculate on a decrease in the price of a particular stock without the risk of unlimited loss.",
    ],
    preview: "Gain exposure to the price movements of a particular stock without actually shorting the stock.",
    image: SyntheticShortStock,
    categories: [
      {
        name: "Bearish",
        color: "danger",
        icon: "icon-bear",
      },
    ],
    labels: [],
    alis: "Short Combination, Combo Strip",
    breakevenlist: ["Leg 1 minus the net debit paid."],
    sweetspotlist: ["stock to go down."],
    maxprofit: "substantial if stock goes to zero, but limited to Leg 1 minus the net debit paid.",
    maxlosslist: ["unlimited if the stock price goes up."],
  },
  {
    id: 39,
    name: "Synthetic Long Straddle Calls",
    description: [
      " A synthetic long straddle with calls is a neutral strategy, as the investor profits if the underlying asset moves significantly in either direction, but incurs a loss if the underlying asset does not move significantly before the options expire. The potential profit for this position is unlimited, as the value of the position will increase with no upper bound as the underlying asset price increases or decreases beyond the strike price. However, the potential loss is limited to the premium paid for the options.",
      "The call option gives the holder the right to buy the underlying asset at the strike price, while the put option gives the holder the right to sell the underlying asset at the strike price.",
      "A synthetic long straddle with calls can be a useful tool for investors who expect the price of the underlying asset to make a significant move, but are uncertain about the direction of the move.",
    ],
    preview:
      "Simultaneously buying a call option and a put option on the same underlying asset with the same expiration date and strike price.",
    image: SyntheticLongStraddleCalls,
    categories: [
      {
        name: "Bi-Directional",
        color: "purple",
        icon: "icon-directional",
      },
    ],
    labels: [],
    alis: "This position is also known as a straddle.",
    breakevenlist: [
      "strike price of the options plus the premium paid for the synthetic position, which is the total cost of the call and put options.",
    ],
    sweetspotlist: ["Stock price either goes way up or way down."],
    maxprofit: "unlimited, as the underlying asset's price can continue to rise beyond the breakeven point.",
    maxlosslist: ["Limited. total premium paid for the position, which is the cost of the call and put options."],
  },
  {
    id: 40,
    name: "Synthetic Long Straddle Puts",
    description: [
      "The goal of this strategy is to profit from significant price movements in either direction. If the underlying asset's price increases significantly, the call option will expire in the money and offset the loss from the put option expiring out of the money. If the underlying asset's price decreases significantly, the put option will expire in the money and offset the loss from the call option expiring out of the money.",
    ],
    preview:
      "Involves buying a put option and a call option with the same strike price and expiration date,and selling the underlying asset. This strategy is similar to a traditional long straddle, but it uses put options instead of call options to create the synthetic position.",
    image: SyntheticLongStraddlePuts,
    categories: [
      {
        name: "Bi-Directional",
        color: "purple",
        icon: "icon-directional",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: [
      "Strike price of the options plus the premium paid for the synthetic position, which is the total cost of the call and put options.",
    ],
    sweetspotlist: ["Stock price either goes way up or way down."],
    maxprofit: "unlimited, as the underlying asset's price can continue to rise or fall beyond the breakeven point.",
    maxlosslist: ["is the total premium paid for the position, which is the cost of the call and put options."],
  },
  {
    id: 41,
    name: "Synthetic Short Straddle Calls",
    description: [
      "The goal of this strategy is to profit from a lack of significant price movement in the underlying asset. If the underlying asset's price remains relatively stable, both the call and put options will expire out of the money and the trader will keep the premium received from selling the options.",
      "The maximum profit for a synthetic short straddle with calls is the total premium received from selling the call and put options. The maximum loss is unlimited, as the underlying asset's price can continue to rise or fall significantly beyond the breakeven point. The breakeven point for this strategy is the strike price of the options minus the premium received for the synthetic position.",
    ],
    preview:
      "Involves selling a call option and a put option with the same strike price and expiration date,and buying the underlying asset. This strategy is similar to a traditional short straddle, but it uses call options instead of put options to create the synthetic position.",
    image: SyntheticShortStraddleCalls,
    categories: [
      {
        name: "Neutral",
        color: "orange",
        icon: "icon-natural",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: ["strike price of the options minus the premium received for the synthetic position."],
    sweetspotlist: ["Stock price either remains flat."],
    maxprofit: "limited. total premium received from selling the call and put options.",
    maxlosslist: ["Unlimited as stock either goes way up or down."],
  },
  {
    id: 42,
    name: "Synthetic Short Straddle Puts",
    description: [
      " is to profit from a decrease in volatility or a narrow trading range in the underlying security. If the underlying security remains relatively stable and doesn't experience significant price fluctuations, the put options that have been sold will expire worthless, and the trader can keep the premium collected from selling the options. If the underlying security does experience significant price movements, the trader may incur losses, potentially unlimited if the price moves significantly in either direction.",
      "It's important to note that a synthetic short straddle with puts is a relatively advanced options trading strategy and may not be suitable for all investors. It is important to thoroughly understand the risks and potential rewards of this strategy before implementing it in a portfolio.",
    ],
    preview:
      "Involves selling a put option and a call option with the same strike price and expiration date, and buying the underlying asset. This creates a synthetic position that is similar to a traditional short straddle, but uses put options instead of call options.",
    image: SyntheticShortStraddlePuts,
    categories: [
      {
        name: "Neutral",
        color: "orange",
        icon: "icon-natural",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: ["strike price of the options plus the premium collected from selling the options."],
    sweetspotlist: ["Stock price either remains flat."],
    maxprofit: "limited. Equal to the premium collected from selling the put options.",
    maxlosslist: ["Unlimited as stock either goes way up or down."],
  },
  {
    id: 43,
    name: "Strip",
    description: [
      "If the price of the underlying security falls significantly, the value of the two put options that have been sold will increase, and the trader can profit by buying back the options at a lower price. If the price of the underlying security remains relatively stable or rises, the options will expire worthless, and the trader will keep the premium collected from selling the options.",
      "Selling two put options and one call option on the same underlying security with the same expiration date. This is also known as a bearish strip. The goal of a strip strategy is to profit from a decline in the price of the underlying security.",
    ],
    preview:
      "Similar to a straddle but with a stronger bearish bias achieved by purchasing twice as many puts. The stock must move in order to generate money, but it will now profit more from a downward movement than from an upward one.",
    image: Strip,
    categories: [
      {
        name: "Bearish",
        color: "danger",
        icon: "icon-bear",
      },
      {
        name: "Bi-Directional",
        color: "purple",
        icon: "icon-directional",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: [" the strike price of the call option minus the premiums collected from selling the put options."],
    sweetspotlist: ["Stock price goes way down."],
    maxprofit: "Unlimited. Equal to the premium collected from selling the put & call options.",
    maxlosslist: [" Limited to the net debit paid."],
  },
  {
    id: 44,
    name: "Strap",
    description: [
      "Involves buying two call options and selling one put option on the same underlying security with the same expiration date. This is also known as a bullish strap. The goal of a strap strategy is to profit from a rise in the price of the underlying security.",
      "If the price of the underlying security rises significantly, the value of the two call options that have been purchased will increase, and the trader can profit by selling the options at a higher price. If the price of the underlying security remains relatively stable or falls, the options will expire worthless, and the trader may incur a loss on the put option that was sold,but this loss will be offset by the premium collected from selling the put option.",
    ],
    preview:
      "Similar to a straddle, but with a stronger bullish bias achieved by purchasing twice as many calls. The stock must move in order to generate money, but it will now profit more from an upward movement than from a downward one.",
    image: Strap,
    categories: [
      {
        name: "Bullish",
        color: "success",
        icon: "icon-bull",
      },
      {
        name: "Bi-Directional",
        color: "purple",
        icon: "icon-directional",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: ["the strike price of the call option plus the premiums collected from selling the put options."],
    sweetspotlist: ["Stock price goes way up."],
    maxprofit: "Unlimited. Equal to the premium collected from selling the put & call options.",
    maxlosslist: [" Limited to the net debit paid."],
  },
  {
    id: 45,
    name: "Long Guts",
    description: [
      "Involves buying a call option and a put option on the same underlying security with the same expiration date and strike price. This is also known as a long straddle. The goal of a long guts strategy is to profit from a significant price movement in either direction in the underlying security.",
      "If the price of the underlying security moves significantly in either direction, the value of one of the options will increase, and the trader can profit by selling the option at a higher price. If the price of the underlying security remains relatively stable, both options will expire worthless, and the trader will incur a loss equal to the premium paid for the options.",
    ],
    preview:
      "Similar to a strangle in that it has the same maximum reward, maximum risk, and possibility of profit, but is more expensive due to the reversal of the put and call positions.",
    image: LongGuts,
    categories: [
      {
        name: "Bi-Directional",
        color: "purple",
        icon: "icon-directional",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: ["strike price plus the premium paid for the options."],
    sweetspotlist: ["Stock price goes way up or way down."],
    maxprofit: "Unlimited as the price of the underlying security could move significantly in either direction.",
    maxlosslist: [
      " Limited. And is equal to the premium paid for the options, which is realised if the underlying security remains relatively stable and both options expire worthless.",
    ],
  },
  {
    id: 46,
    name: "Short Guts",
    description: [
      "Involves selling a call option and a put option on the same underlying security with the same expiration date and strike price. This is also known as a short straddle. The goal of a short guts strategy is to profit from a narrow trading range or a decrease in volatility in the underlying security.",
      "If the price of the underlying security remains relatively stable and doesn't experience significant price movements, both options will expire worthless, and the trader can keep the premium collected from selling the options. If the price of the underlying security moves significantly in either direction, the trader may incur losses on one or both options.",
    ],
    preview: "The opposite of Long Guts, and similar to a short straddle.",
    image: ShortGuts,
    categories: [
      {
        name: "Neutral",
        color: "orange",
        icon: "icon-natural",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: [
      "strike price of the call option plus the premium collected from selling the call and put options, minus the strike price of the put option minus the premium collected from selling the put option.",
    ],
    sweetspotlist: ["Stock price stays flat."],
    maxprofit: "Limited, premium collected from selling the call and put options.",
    maxlosslist: ["Unlimited if the stock price goes way down or way up."],
  },
  {
    id: 47,
    name: "Collar",
    description: [
      "Involves purchasing a protective put option and simultaneously selling a covered call option on the same underlying security. The goal of this strategy is to protect against a potential decline in the price of the underlying security while also generating income through the sale of the call option.",
      'In a collar strategy, the strike price of the put option is typically set below the current market price of the underlying security, while the strike price of the call option is set above the current market price. This creates a "collar" around the current market price of the underlying security, which helps to limit the potential losses from a decline in the price of the underlying security.',
    ],
    preview:
      "A tactic to use if you hold underlying stock and are cautiously bullish about it. It functions similarly to a covered call and protected put combined in that it limits your upside potential by selling the stock if the stock rises above Leg 2.",
    image: Collar,
    categories: [
      {
        name: "Bullish",
        color: "success",
        icon: "icon-bull",
      },
    ],
    labels: ["Stock"],
    alis: "Risk-reversal",
    breakevenlist: [
      "strike price of the call option minus the premium collected from selling the call option, plus the strike price of the put option minus the premium collected.",
    ],
    sweetspotlist: ["Stock price goes above Leg 3."],
    maxprofit: "Limited to the premium received from selling the call option, minus the cost of the put option.",
    maxlosslist: ["UnLimited, as the value of the underlying asset could theoretically continue to decrease."],
  },
  {
    id: 48,
    name: "Long Combo",
    description: [
      "Involves buying a call option and a put option on the same underlying asset, with both options having the same expiration date but different strike prices. This strategy allows the trader to profit from either an increase or a decrease in the price of the underlying asset,as the long call option will increase in value if the price of the underlying asset rises,while the long put option will increase in value if the price of the underlying asset falls. The trader's potential profit is limited to the difference between the strike prices of the two options, minus any premiums paid and commissions or fees associated with the trade.",
    ],
    preview:
      "This trade will only profit or lose if the stock moves below Leg 1 or above Leg 2 rather than between the strikes at expiration. As it gets closer to expiration, it acts more like a synthetic future.",
    image: LongCombo,
    categories: [
      {
        name: "Neutral",
        color: "orange",
        icon: "icon-natural",
      },
      {
        name: "Bullish",
        color: "success",
        icon: "icon-bull",
      },
    ],
    labels: [],
    alis: "Long call & put combo, Call & put spread.",
    breakevenlist: [
      "Sum of the strike price of the put option and the premium paid for the put option,minus the strike price of the call option and the premium received for the call option.",
    ],
    sweetspotlist: ["Stock price goes way above Leg 2."],
    maxprofit: "UnLimited as stock goes way above Leg 2.",
    maxlosslist: ["limited to the premium paid for the put option, minus the premium received for the call option."],
  },
  {
    id: 49,
    name: "Short Combo",
    description: [
      "Involves selling a call option and a put option on the same underlying asset, with both options having the same expiration date but different strike prices. This strategy allows the trader to profit from a narrow range of prices for the underlying asset, as the trader will receive a premium for selling both options but will also be obligated to buy or sell the underlying asset at the strike price of the option if it is exercised.",
    ],
    preview:
      "This trade will only profit or lose if the stock moves below Leg 1 or above Leg 2 rather than between the strikes at expiration. It behaves like a short synthetic future when it is further away from expiration.",
    image: ShortCombo,
    categories: [
      {
        name: "Neutral",
        color: "orange",
        icon: "icon-natural",
      },
      {
        name: "Bearish",
        color: "danger",
        icon: "icon-bear",
      },
    ],
    labels: [],
    alis: "short call and put combo, a call and put spread.",
    breakevenlist: [
      "Sum of the strike price of the call option and the premium received for the call option, minus the strike price of the put option and the premium received for the put option.",
    ],
    sweetspotlist: ["Stock price falls way below Leg 1."],
    maxprofit: "limited to the difference between the premiums received for the call and put options.",
    maxlosslist: [
      "Unlimited, as the value of the underlying asset could theoretically continue to increase or decrease without any upper or lower bound..",
    ],
  },
  {
    id: 50,
    name: "Long Box",
    description: [
      "Involves buying a call option and a put option on the same underlying asset, with both options having the same expiration date and strike price. This strategy allows the trader to profit from a neutral market, as the trader will profit if the price of the underlying asset is above or below the strike price at expiration. The trader's potential profit is limited to the difference between the strike price and the lower of the two premiums paid, minus any commissions or fees associated with the trade.",
    ],
    preview: "Neutral market by buying a call option and a put option on the same asset.",
    image: LongBox,
    categories: [
      {
        name: "Bearish",
        color: "danger",
        icon: "icon-bear",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: ["Stock price of the underlying asset is at or below the leg 1."],
    sweetspotlist: ["Stock price falls below Leg 1."],
    maxprofit: "limited to the difference between the strike price and the lower of the two premiums paid.",
    maxlosslist: ["Limited to the higher of the two premiums paid, minus the lower of the two premiums paid."],
  },
  {
    id: 51,
    name: "Call Vertical spread",
    description: [
      'Involves selling a number of call options at a lower strike price and simultaneously buying a greater number of call options at a higher strike price, with both sets of options having the same expiration date. The trader will typically sell more call options at the lower strike price than they buy at the higher strike price, creating a "backspread" with a negative delta.',
    ],
    preview:
      "A very bullish approach that results in large profits when the stock makes a significant upward move and losses when it moves just a little. Even if you're set up for a net credit and the stock declines, you could still make a modest profit.",
    image: CallVerticalSpread,
    categories: [
      {
        name: "Bullish",
        color: "success",
        icon: "icon-bull",
      },
      {
        name: "Bi-Directional",
        color: "purple",
        icon: "icon-directional",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: [
      " lower strike price of the short call options plus the premium received for those options, minus the higher strike price of the long call options and the premium paid for those options.",
    ],
    sweetspotlist: ["Stock is very Bullish."],
    maxprofit:
      "Unlimited, as the price of the underlying asset could theoretically continue to increase without any upper bound.",
    maxlosslist: [
      "is limited to the difference between the strike prices of the options, minus any premiums received for the short call options and any commissions or fees associated with the trade.",
    ],
  },
  {
    id: 52,
    name: "Put Vertical spread",
    description: [
      'Involves selling a number of put options at a higher strike price and simultaneously buying a greater number of put options at a lower strike price, with both sets of options having the same expiration date. The trader will typically sell more put options at the higher strike price than they buy at the lower strike price, creating a "backspread" with a positive delta.',
      "The goal of a ratio put backspread is to profit from a significant decrease in the price of the underlying asset. If the price of the underlying asset decreases enough, the long put options at the lower strike price will increase in value faster than the short put options at the higher strike price, resulting in a profit for the trader. However, if the price of the underlying asset does not decrease enough or increases, the trader will incur a loss.",
    ],
    preview:
      "A very bullish approach that results in large profits when the stock makes a significant upward move and losses when it moves just a little. Even if you're set up for a net credit and the stock declines, you could still make a modest profit.",
    image: PutVerticalSpread,
    categories: [
      {
        name: "Bearish",
        color: "danger",
        icon: "icon-bear",
      },
      {
        name: "Bi-Directional",
        color: "purple",
        icon: "icon-directional",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: [
      "Higher strike price of the short put options minus the premium received for those options, minus the lower strike price of the long put options and the premium paid for those options.",
    ],
    sweetspotlist: ["stock price goes way low."],
    maxprofit:
      "Limited to the difference between the strike prices of the options, minus any premiums received for the short put options.",
    maxlosslist: [
      "is limited to the difference between the strike prices of the options, minus any premiums received for the short put options and any commissions or fees associated with the trade.",
    ],
  },
  {
    id: 4,
    name: "Cash Secured Put",
    description: [
      "If the stock price declines below the strike price before the put option expires, the buyer of the option may exercise their right to sell the stock at the higher strike price.",
      "The maximum profit for a short put strategy is the premium received, while the maximum loss is limited to the difference between the strike price and the stock price, plus the premium received. The value of the put option will also increase as time passes and is sensitive to changes in volatility.",
      "It's important to note that selling a put option carries significant risk, as the investor is exposed to potential losses if the stock price declines significantly. As such, this strategy is not suitable for all investors and should be carefully considered before being implemented.",
      "The reason some traders run this play is that there is a high probability for success when selling very out-of-the-money puts. Ensure a stop-loss plan in place if the stock price goes down.",
    ],
    preview:
      "This strategy has a low profit potential if the stock remains above the Leg 1 (strike price) at expiration. However, unlimited risk if the stock goes down.",
    image: ShortPut,
    categories: [
      {
        name: "Bullish",
        color: "success",
        icon: "icon-bull",
      },
    ],
    labels: [],
    alis: "",
    breakevenlist: ["Leg 1 minus premium received for the put"],
    sweetspotlist: ["Stock price is at or above leg 1 (strike price) at expiration date."],
    maxprofit: "Profit is limited to premium received for selling the put",
    maxlosslist: ["Risk is nearly unlimited loss if stock keeps going below Leg 1/strike price."],
  },
];
