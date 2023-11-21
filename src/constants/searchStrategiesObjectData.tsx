// RS:- Options strategies - Search functionalities object creation

const searchStrategiesObjectData = [
  {
    label: "Starter",
    id: 1,
    labelTranslationKey: "strategies.Starter.title",
    children: [
      {
        key: "Long Call",
        translationKey: "strategies.Starter.Long Call",
        strategyId: 1,
        icon: "icon-bull",
      },
      {
        key: "Short Call",
        translationKey: "strategies.Starter.Short Call",
        strategyId: 2,
        icon: "icon-bear",
      },
      {
        key: "Long Put",
        translationKey: "strategies.Starter.Long Put",
        strategyId: 3,
        icon: "icon-bear",
      },
      {
        key: "Short Put",
        translationKey: "strategies.Starter.Short Put",
        strategyId: 4,
        icon: "icon-bull",
      },
    ],
  },
  {
    label: "Proficient",
    id: 2,
    labelTranslationKey: "strategies.Proficient.title",
    children: [
      {
        key: "Covered Call",
        translationKey: "strategies.Proficient.Covered Call",
        strategyId: 5,
        icon: "icon-natural",
      },
      {
        key: "Cash Secured Put",
        translationKey: "Cash Secured Put",
        strategyId: 6,
        icon: "icon-bull",
      },
    ],
  },
  {
    label: "Debit Spreads",
    id: 3,
    labelTranslationKey: "strategies.DebitSpreads.title",
    children: [
      {
        key: "Bull Call Spread",
        translationKey: "strategies.Spreads.Bull Call Spread",
        strategyId: 7,
        icon: "icon-bull",
      },
      {
        key: "Bear Put Spread",
        translationKey: "strategies.Spreads.Bear Put Spread",
        strategyId: 8,
        icon: "icon-bear",
      },
    ],
  },
  {
    label: "Credit Spreads",
    id: 4,
    labelTranslationKey: "strategies.CreditSpreads.title",
    children: [
      {
        key: "Bear Call Spread",
        translationKey: "strategies.Spreads.Bear Call Spread",
        strategyId: 9,
        icon: "icon-bear",
      },
      {
        key: "Bull Put Spread",
        translationKey: "strategies.Spreads.Bull Put Spread",
        strategyId: 10,
        icon: "icon-bear",
      },
      {
        key: "Call Vertical Spread",
        translationKey: "strategies.Spreads.Call Vertical Spread",
        strategyId: 11,
        icon: "icon-bull",
      },
      {
        key: "Put Vertical Spread",
        translationKey: "strategies.Spreads.Put Vertical Spread",
        strategyId: 12,
        icon: "icon-bear",
      },
    ],
  },
  {
    label: "Condors",
    id: 5,
    labelTranslationKey: "strategies.Condors.title",
    children: [
      {
        key: "Long Call Condor",
        translationKey: "strategies.Condors.Long Call Condor",
        strategyId: 13,
        icon: "icon-natural",
      },
      {
        key: "Long Put Condor",
        translationKey: "strategies.Condors.Long Put Condor",
        strategyId: 14,
        icon: "icon-natural",
      },
      {
        key: "Iron Condor",
        translationKey: "strategies.Condors.Iron Condor",
        strategyId: 15,
        icon: "icon-natural",
      },
      {
        key: "Short Call Condor",
        translationKey: "strategies.Condors.Short Call Condor",
        strategyId: 16,
        icon: "icon-directional",
      },
      {
        key: "Short Put Condor",
        translationKey: "strategies.Condors.Short Put Condor",
        strategyId: 17,
        icon: "icon-directional",
      },
      {
        key: "Reverse Iron Condor",
        translationKey: "strategies.Condors.Reverse Iron Condor",
        strategyId: 18,
        icon: "icon-directional",
      },
    ],
  },
  {
    label: "Straddles",
    id: 6,
    labelTranslationKey: "strategies.Straddles.title",
    children: [
      {
        key: "Long Straddle",
        translationKey: "strategies.Straddles.Long Straddle",
        strategyId: 19,
        icon: "icon-directional",
      },
      {
        key: "Short Straddle",
        translationKey: "strategies.Straddles.Short Straddle",
        strategyId: 20,
        icon: "icon-natural",
      },
      {
        key: "Covered Short Straddle",
        translationKey: "strategies.Straddles.Covered Short Straddle",
        strategyId: 21,
        icon: "icon-bull",
      },
    ],
  },
  {
    label: "Strangles",
    id: 7,
    labelTranslationKey: "strategies.Strangles.title",
    children: [
      {
        key: "Long Straddle",
        translationKey: "strategies.Strangles.Long Strangle",
        strategyId: 22,
        icon: "icon-directional",
      },
      {
        key: "Short Straddle",
        translationKey: "strategies.Strangles.Short Strangle",
        strategyId: 23,
        icon: "icon-natural",
      },
      {
        key: "Covered Short Straddle",
        translationKey: "strategies.Strangles.Covered Short Strangle",
        strategyId: 24,
        icon: "icon-bull",
      },
    ],
  },
  {
    label: "Butterfly",
    id: 8,
    labelTranslationKey: "strategies.Butterfly.title",
    children: [
      {
        key: "Long Call Butterfly",
        translationKey: "strategies.Butterfly.Long Call Butterfly",
        strategyId: 25,
        icon: "icon-natural",
      },
      {
        key: "Long Put Butterfly",
        translationKey: "strategies.Butterfly.Long Put Butterfly",
        strategyId: 26,
        icon: "icon-natural",
      },
      {
        key: "Iron Butterfly",
        translationKey: "strategies.Butterfly.Iron Butterfly",
        strategyId: 27,
        icon: "icon-natural",
      },
      {
        key: "Short Call Butterfly",
        translationKey: "strategies.Butterfly.Short Call Butterfly",
        strategyId: 28,
        icon: "icon-directional",
      },
      {
        key: "Short Put Butterfly",
        translationKey: "strategies.Butterfly.Short Put Butterfly",
        strategyId: 29,
        icon: "icon-directional",
      },
      {
        key: "Reverse Iron Butterfly",
        translationKey: "strategies.Butterfly.Reverse Iron Butterfly",
        strategyId: 30,
        icon: "icon-directional",
      },
    ],
  },
  {
    label: "Ladder",
    id: 9,
    labelTranslationKey: "strategies.Ladder.title",
    children: [
      {
        key: "Bull Call Ladder",
        translationKey: "strategies.Ladder.Bull Call Ladder",
        strategyId: 31,
        icon: "icon-natural",
        icon2: "icon-bull",
      },
      {
        key: "Bull Put Ladder",
        translationKey: "strategies.Ladder.Bull Put Ladder",
        strategyId: 32,
        icon: "icon-directional",
      },
      {
        key: "Bear Call Ladder",
        translationKey: "strategies.Ladder.Bear Call Ladder",
        strategyId: 33,
        icon: "icon-directional",
      },
      {
        key: "Bear Put Ladder",
        translationKey: "strategies.Ladder.Bear Put Ladder",
        strategyId: 34,
        icon: "icon-natural",
      },
    ],
  },
  {
    label: "Synthetic",
    id: 10,
    labelTranslationKey: "strategies.Synthetic.title",
    children: [
      {
        key: "Synthetic.Synthetic Call",
        translationKey: "strategies.Synthetic.Synthetic Call",
        strategyId: 35,
        icon: "icon-bull",
      },
      {
        key: "Synthetic.Synthetic Put",
        translationKey: "strategies.Synthetic.Synthetic Put",
        strategyId: 36,
        icon: "icon-bear",
      },
      {
        key: "Synthetic Long Stock",
        translationKey: "strategies.Synthetic.Synthetic Long Stock",
        strategyId: 37,
        icon: "icon-bull",
      },
      {
        key: "Synthetic Short Stock",
        translationKey: "strategies.Synthetic.Synthetic Short Stock",
        strategyId: 38,
        icon: "icon-bear",
      },
      {
        key: "Synthetic Long Straddle Calls",
        translationKey: "Synthetic Long Straddle Calls",
        strategyId: 39,
        icon: "icon-directional",
      },
      {
        key: "Long Straddle Puts",
        translationKey: "strategies.Synthetic.Synthetic Long Straddle Puts",
        strategyId: 40,
        icon: "icon-directional",
      },
      {
        key: "Short Straddle Calls",
        translationKey: "strategies.Synthetic.Synthetic Short Straddle Calls",
        strategyId: 41,
        icon: "icon-natural",
      },
      {
        key: "Short Straddle Puts",
        translationKey: "strategies.Synthetic.Synthetic Short Straddle Puts",
        strategyId: 42,
        icon: "icon-natural",
      },
    ],
  },
  {
    label: "More",
    id: 11,
    labelTranslationKey: "strategies.More.title",
    children: [
      {
        key: "Strip",
        translationKey: "strategies.More.Strip",
        strategyId: 43,
        icon: "icon-bear",
        icon2: "icon-directional",
      },
      {
        key: "Strap",
        translationKey: "strategies.More.Strap",
        strategyId: 44,
        icon: "icon-bull",
        icon2: "icon-directional",
      },
      {
        key: "Long Guts",
        translationKey: "strategies.More.Long Guts",
        strategyId: 45,
        icon: "icon-directional",
      },
      {
        key: "Short Guts",
        translationKey: "strategies.More.Short Guts",
        strategyId: 46,
        icon: "icon-natural",
      },
      {
        key: "Collar",
        translationKey: "strategies.More.Collar",
        strategyId: 47,
        icon: "icon-bull",
      },
      {
        key: "Long Combo",
        translationKey: "strategies.More.Long Combo",
        strategyId: 48,
        icon: "icon-natural",
      },
      {
        key: "Short Combo",
        translationKey: "strategies.More.Short Combo",
        strategyId: 49,
        icon: "icon-bear",
      },
      {
        key: "Long Box",
        translationKey: "strategies.More.Long Box",
        strategyId: 50,
        icon: "icon-bear",
        icon2: "icon-directional",
      },
      {
        key: "Call Vertical Spread",
        translationKey: "strategies.More.Call Vertical Backspread",
        strategyId: 51,
        icon: "icon-bull",
        icon2: "icon-directional",
      },
      {
        key: "Put Vertical Spread",
        translationKey: "strategies.More.Put Vertical Backspread",
        strategyId: 52,
        icon: "icon-bear",
      },
      {
        key: "Protective Put",
        translationKey: "strategies.Proficient.Protective Put",
        strategyId: 53,
        icon: "icon-bull",
      },
    ],
  },
];

export const getAccordianId = (strategyId = 1) => {
  if (!strategyId) {
    return null;
  }
  let selectedStrategy: number | null = null;
  [...searchStrategiesObjectData].every((strategy) => {
    const activeStrategy = strategy.children.find((el) => el.strategyId == strategyId);
    if (activeStrategy) {
      selectedStrategy = strategy.id;
      return false;
    }
    return true;
  });
  return selectedStrategy;
};

export const getStratergyNameForStrategyId = (strategyId) => {
  for (const strategy of searchStrategiesObjectData) {
    const foundStrategy = strategy.children.find((child) => child.strategyId === strategyId);
    if (foundStrategy) {
      return foundStrategy.key;
    }
  }
  return null;
};

export default searchStrategiesObjectData;
