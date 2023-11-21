import { configureStore } from "@reduxjs/toolkit";
import recentSearchReducer from "./slices/recentSearchSlice";
import tradingDataReducer from "./slices/tradeDataSlice";
import tradingGraphDataReducer from "./slices/tradeGraphSlice";
import watchlistDataReducer from "./slices/watchlistSlice";
import closeMarketDataReducer from "./slices/closeMarketSlice";
import optionStrategyReducer from "./slices/optionStrategySlice";
import placeOrderReducer from "./slices/placeOrderSlice";
import optionGreekReducer from "./slices/optionGreekSlice";
import optionGreekChainsReducer from "./slices/optionGreekChainsSlice";
import chainsDetailsReducer from "./slices/chainsDetailsSlice";
// import { graphData } from "./slices/tradeGraphSlice";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import strategiesReducer from "@/redux/slices/optionTypeSlice";
import summeriesReducer from "@/redux/slices/summerySlice";
import loginReducer from "@/redux/slices/loginSlice";
import cashFlowReducer from "@/redux/slices/cashflowSlice";
import ordersReducer from "@/redux/slices/orderListSlice";
import positionsReducer from "@/redux/slices/positionListSlice";
import balancesReducer from "@/redux/slices/balanceSlice";
import accountHistoryReducer from "@/redux/slices/accountHistorySlice";
import accountGainLossReducer from "@/redux/slices/accountGainLossSlice";
import profileReducer from "@/redux/slices/profileSlice";
import quoteReducer from "@/redux/slices/quoteSlice";
import timeSalesRducer from "@/redux/slices/timeSalesSlice";
import allStrategiesReducer from "./slices/allStrategiesSlice";
import allDatesIndexesReducer from "./slices/allDatesIndexSlice";
import datesSelectedReducer from "./slices/datesSelectionSlice";
import dividendsReducer from "./slices/dividendsSlice";
import calendarsReducer from "./slices/calendarsSlice";
import strikesReducer from "./slices/strikeDetailSlice";

export const store = configureStore({
  reducer: {
    searchStock: recentSearchReducer,
    tradeData: tradingDataReducer,
    tradeGraphData: tradingGraphDataReducer,
    watchlistData: watchlistDataReducer,
    closeMarketGraphData: closeMarketDataReducer,
    optionStrategySelection: optionStrategyReducer,
    optionGreek: optionGreekReducer,
    optionGreekChains: optionGreekChainsReducer,
    chainsDetails: chainsDetailsReducer,
    strategies: strategiesReducer,
    summeries: summeriesReducer,
    loginData: loginReducer,
    cashFlowData: cashFlowReducer,
    allStrategies: allStrategiesReducer,
    allDatesIndexes: allDatesIndexesReducer,
    datesSelected: datesSelectedReducer,
    orderList: ordersReducer,
    positionList: positionsReducer,
    profileData: profileReducer,
    balancesData: balancesReducer,
    accountHistory: accountHistoryReducer,
    accountGainLoss: accountGainLossReducer,
    quotesData: quoteReducer,
    placeOrder: placeOrderReducer,
    timeSales: timeSalesRducer,
    dividendsData: dividendsReducer,
    calendarsData: calendarsReducer,
    allStrikes: strikesReducer,
    // [graphData.reducerPath]: graphData.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
