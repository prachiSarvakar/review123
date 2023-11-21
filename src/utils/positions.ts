import { strategyName } from "./getStrategyName";
import { Leg, DirectionType, LegType } from "./legs";
import { addCommasToNumber } from "./prize";
import { getStratergyNameForStrategyId } from "@/constants/searchStrategiesObjectData";

interface LegData {
  strike: number;
  type: LegType;
  expiration: Date;
  ticker: string;
}

export function getStrategyIdFromLegs(legs: Leg[]): number {
  switch (legs?.length) {
    case 1:
      return getSingleLegStrategyId(legs[0]);
    case 2:
      return getDoubleLegStrategyId(legs[0], legs[1]);
    case 3:
      return getTripleLegStrategyId(legs);
    case 4:
      return getQuadLegStrategyId(legs);
    default:
      return 0;
  }
}

function getSingleLegStrategyId(leg: Leg | undefined | null): number {
  if (!leg) {
    return 0;
  }

  switch (leg.type) {
    case LegType.Call:
      return leg.direction === DirectionType.Buy ? 1 : 2;
    case LegType.Put:
      return leg.direction === DirectionType.Buy ? 3 : 4;
    case LegType.Stock:
      return 0;
    default:
      return 0;
  }
}

function getDoubleLegStrategyId(first: Leg | null, second: Leg | null): number {
  if (!first || !second) {
    return 0;
  }

  switch (first.type) {
    case LegType.Call:
      if (second.type === LegType.Call) {
        const buyCall = first.direction === DirectionType.Buy ? first : second;
        const sellCall = second.direction === DirectionType.Sell ? second : first;
        if (buyCall.strike <= sellCall.strike) {
          return sellCall.size === 1
            ? 7
            : buyCall.expiration === sellCall.expiration
            ? 11
            : buyCall.strike === sellCall.strike
            ? 56
            : 54;
        }
        return sellCall.size === buyCall.size
          ? 9
          : buyCall.expiration === sellCall.expiration
          ? 51
          : buyCall.strike === sellCall.strike
          ? 56
          : 54;
      }
      break;

    case LegType.Put:
      if (second.type === LegType.Put) {
        const sellPut = first.direction === DirectionType.Sell ? first : second;
        const buyPut = second.direction === DirectionType.Buy ? second : first;
        if (sellPut.strike <= buyPut.strike) {
          return sellPut.size === 1
            ? 8
            : buyPut.expiration.getTime() === sellPut.expiration.getTime()
            ? 12
            : buyPut.strike === sellPut.strike
            ? 57
            : 55;
        }
        return sellPut.size === buyPut.size
          ? 10
          : buyPut.expiration.getTime() === sellPut.expiration.getTime()
          ? 52
          : buyPut.strike === sellPut.strike
          ? 57
          : 55;
      }
      break;

    case LegType.Stock:
      if (second.type === LegType.Call || second.type === LegType.Stock) {
        if (
          (first.type === LegType.Stock && first.direction === DirectionType.Buy) ||
          (second.type === LegType.Stock && second.direction === DirectionType.Buy)
        ) {
          return 5;
        }
        return 36;
      } else if (second.type === LegType.Put) {
        return 6;
      }
      break;
  }

  if (
    (first.type === LegType.Put && second.type === LegType.Call) ||
    (second.type === LegType.Put && first.type === LegType.Call)
  ) {
    const putLeg = first.type === LegType.Put ? first : second;
    const callLeg = second.type === LegType.Call ? second : first;

    if (first.direction === DirectionType.Buy && second.direction === DirectionType.Buy) {
      if (putLeg.size === callLeg.size) {
        return putLeg.strike === callLeg.strike ? 19 : 22;
      } else if (putLeg.strike === callLeg.strike) {
        return putLeg.size === callLeg.size * 2 ? 43 : 44;
      }
      return 45;
    } else if (first.direction === DirectionType.Sell && second.direction === DirectionType.Sell) {
      return first.strike === second.strike ? 20 : 23;
    }
    return putLeg.direction === DirectionType.Sell ? 37 : 38;
  } else if (first.type === LegType.Stock && second.type === LegType.Stock) {
    return 0;
  }

  return 0;
}

function getTripleLegStrategyId(legs: Leg[]): number {
  const sortedLegs = legs.slice().sort((a, b) => a.strike - b.strike);
  const first = sortedLegs[0];
  const second = sortedLegs[1];
  const third = sortedLegs[2];

  switch ([first.type, second.type, third.type].toString()) {
    case [LegType.Stock, LegType.Put, LegType.Call].toString():
    case [LegType.Stock, LegType.Call, LegType.Put].toString():
    case [LegType.Call, LegType.Stock, LegType.Put].toString():
    case [LegType.Call, LegType.Put, LegType.Stock].toString():
    case [LegType.Put, LegType.Stock, LegType.Call].toString():
    case [LegType.Put, LegType.Call, LegType.Stock].toString():
      const nonStockLegs = legs.filter((leg) => leg.type !== LegType.Stock).sort((a, b) => a.strike - b.strike);

      if (nonStockLegs[0]?.type === LegType.Put && nonStockLegs[0]?.direction === DirectionType.Buy) {
        return 47;
      }
      return nonStockLegs[0]?.strike === nonStockLegs[nonStockLegs.length - 1]?.strike ? 21 : 24;

    case [LegType.Call, LegType.Call, LegType.Call].toString():
      if (
        first.direction === DirectionType.Buy &&
        second.direction === DirectionType.Sell &&
        third.direction === DirectionType.Sell
      ) {
        return 31;
      } else if (
        first.direction === DirectionType.Sell &&
        second.direction === DirectionType.Buy &&
        third.direction === DirectionType.Buy
      ) {
        return 33;
      }
      return first.direction === DirectionType.Buy ? 25 : 28;

    case [LegType.Put, LegType.Put, LegType.Put].toString():
      if (
        first.direction === DirectionType.Buy &&
        second.direction === DirectionType.Buy &&
        third.direction === DirectionType.Sell
      ) {
        return 32;
      } else if (
        first.direction === DirectionType.Sell &&
        second.direction === DirectionType.Sell &&
        third.direction === DirectionType.Buy
      ) {
        return 34;
      }
      return first.direction === DirectionType.Buy ? 26 : 29;

    case [LegType.Stock, LegType.Call, LegType.Call].toString():
    case [LegType.Call, LegType.Stock, LegType.Call].toString():
    case [LegType.Call, LegType.Call, LegType.Stock].toString():
      const nonStockLegsCall = legs.filter((leg) => leg.type !== LegType.Stock);
      return nonStockLegsCall[0]?.direction === DirectionType.Buy ? 39 : 41;

    case [LegType.Stock, LegType.Put, LegType.Put].toString():
    case [LegType.Put, LegType.Stock, LegType.Put].toString():
    case [LegType.Put, LegType.Put, LegType.Stock].toString():
      const nonStockLegsPut = legs.filter((leg) => leg.type !== LegType.Stock);
      return nonStockLegsPut[0]?.direction === DirectionType.Buy ? 40 : 42;

    default:
      return 0;
  }
}

function getQuadLegStrategyId(legs: Leg[]): number {
  const sortedLegs = legs.slice().sort((a, b) => a.strike - b.strike);
  const first = sortedLegs[0];
  const second = sortedLegs[1];
  const third = sortedLegs[2];
  const fourth = sortedLegs[3];
  switch ([first.type, second.type, third.type, fourth.type].toString()) {
    case [LegType.Call, LegType.Call, LegType.Call, LegType.Call].toString():
      if (first.direction === DirectionType.Buy && fourth.direction === DirectionType.Buy) {
        return 13;
      }
      return 16;

    case [LegType.Put, LegType.Put, LegType.Put, LegType.Put].toString():
      if (first.direction === DirectionType.Buy && fourth.direction === DirectionType.Buy) {
        return 14;
      }
      return 17;

    case [LegType.Put, LegType.Put, LegType.Call, LegType.Call].toString():
    case [LegType.Put, LegType.Call, LegType.Put, LegType.Call].toString():
    case [LegType.Put, LegType.Call, LegType.Call, LegType.Put].toString():
    case [LegType.Call, LegType.Put, LegType.Call, LegType.Put].toString():
    case [LegType.Call, LegType.Call, LegType.Put, LegType.Put].toString():
      if (first.direction === DirectionType.Buy && fourth.direction === DirectionType.Buy) {
        return second.strike === third.strike ? 27 : 15;
      } else if (
        first.type === LegType.Put &&
        first.direction === DirectionType.Sell &&
        fourth.type === LegType.Call &&
        fourth.direction === DirectionType.Sell
      ) {
        return 50;
      }
      return second.strike === third.strike ? 30 : 18;

    default:
      return 0;
  }
}

export const getUpcomingEvent = (calenderData) => {
  const currentDate = new Date(); // Get the current date
  let nextEventDate = null;
  if (calenderData) {
    for (const result of calenderData) {
      if (
        result.type === "Company" &&
        result.tables.corporate_calendars &&
        Array.isArray(result.tables.corporate_calendars)
      ) {
        const corporateCalendars = result.tables.corporate_calendars.slice(); // Create a new array
        corporateCalendars.sort((a, b) => {
          const dateA = new Date(a.begin_date_time);
          const dateB = new Date(b.begin_date_time);

          if (dateA < dateB) return -1;
          if (dateA > dateB) return 1;
          return 0;
        });

        for (const event of corporateCalendars) {
          const eventBeginDateTime = new Date(event.begin_date_time);

          // Check if the event date is in the future
          if (eventBeginDateTime > currentDate) {
            // Store the event date in the same format as the original data (string)
            nextEventDate = event.begin_date_time;
            break; // Break out of the loop once the next event is found
          }
        }
      }
    }
  }
  return nextEventDate;
};

function convertDateString(inputString) {
  // Split the input string into parts
  const parts = inputString.split(" ");

  // Check if the inputString has the expected number of parts
  if (parts.length === 6) {
    const month = parts[1];
    const day = parts[2];
    const year = parts[3].slice(-2); // Extract the last two digits of the year

    // Reconstruct the formatted date string
    const formattedDate = `${month} ${day} ‘${year}`;
    parts.splice(1, 3, formattedDate); // Replace the original date part
    parts.shift();
    // Join the parts back together with spaces
    const convertedString = parts.join(" ");
    return convertedString;
  } else {
    // Handle invalid input
    return "Invalid input format";
  }
}

function convertToDate(expirationDateString) {
  const year = 2000 + parseInt(expirationDateString.slice(0, 2));
  const month = parseInt(expirationDateString.slice(2, 4)) - 1;
  const day = parseInt(expirationDateString.slice(4, 6));

  return new Date(year, month, day);
}

export function getDetailsFromSymbol(symbol: string | null): LegData {
  if (symbol?.length < 15 || !/[0-9]/.test(symbol)) {
    return {
      strike: 0,
      type: LegType.Stock,
      expiration: new Date(),
      ticker: symbol || "",
    };
  }

  const strike = Number(symbol.slice(-8));
  const strikePrice = strike / 1000;
  const legTypeWithStrike = symbol.slice(-9);
  let legType = legTypeWithStrike.charAt(0);
  let type = legType === "C" ? LegType.Call : legType === "P" ? LegType.Put : LegType.Stock;

  const expirationDateString = symbol.slice(-15).replace(legTypeWithStrike, "");
  const expiryDate = convertToDate(expirationDateString) || new Date();

  const companySymbol = symbol.replace(symbol.slice(-15), "");

  return {
    strike: strikePrice,
    type,
    expiration: expiryDate,
    ticker: companySymbol,
  };
}

export const sortAlphabetically = (mergedArray) => {
  const sorted = [...mergedArray].sort((a, b) => {
    const symbolA = a.symbol.toUpperCase();
    const symbolB = b.symbol.toUpperCase();

    if (symbolA < symbolB) {
      return -1;
    }
    if (symbolA > symbolB) {
      return 1;
    }
    return 0;
  });

  return sorted;
};

const callDiffTimeCoveredGrouping = (groupedData) => {
  Object.keys(groupedData).forEach((timestamp) => {
    Object.keys(groupedData[timestamp]).forEach((symbolKey) => {
      let mainPositions = [];
      let shouldBreak = false;
      Object.keys(groupedData).forEach((timestamp2) => {
        Object.keys(groupedData[timestamp2]).forEach((symbolKey2) => {
          if (symbolKey === symbolKey2) {
            const mainPosition = (groupedData[timestamp2][symbolKey2].main || []).find(
              (position) => position.quantity >= 100
            );
            if (shouldBreak) {
              return; // Exit the outer loop
            }
            if (mainPosition) {
              mainPositions.push(mainPosition);
              // Break out of both loops using the label
              shouldBreak = true;
            }
          }
        });
        if (shouldBreak) {
          return; // Exit the outer loop
        }
      });

      const groupedArrayRemovedEmpty = (groupedData[timestamp][symbolKey].others || []).filter(
        (position) => Object.keys(position).length > 0
      );
      const shortCallPositions =
        groupedArrayRemovedEmpty.length === 1
          ? (groupedData[timestamp][symbolKey].others || []).filter(
              (position) => position.type === LegType.Call && position.quantity < 0
            )
          : [];

      if (mainPositions.length > 0 && shortCallPositions.length > 0) {
        mainPositions.map((position) => {
          if (position.quantity >= 100) {
            const multiplesOf100 = Math.floor(position.quantity / 100);
            if (multiplesOf100 > 0) {
              // Create a new position with the multiples of 100 quantity
              const newPosition = { ...position };

              const coastPerStock = newPosition.cost_basis / newPosition.quantity;

              newPosition.quantity = Math.abs(shortCallPositions[0].quantity) * 100;
              // // Subtract the multiples of 100 from the original position
              position.quantity -= Math.abs(shortCallPositions[0].quantity) * 100;

              // divided coast basis
              newPosition.cost_basis = coastPerStock * newPosition.quantity;
              position.cost_basis = coastPerStock * position.quantity;

              groupedData[timestamp][symbolKey].others.unshift({
                ...newPosition,
              });

              // Push the new position into groupedData[timestamp][symbolKey].main
              groupedData[timestamp][symbolKey].main[0] = {
                ...groupedData[timestamp][symbolKey].main[0],
                descriptionId: 5,
                description: getStratergyNameForStrategyId(5),
              };
              if (position.quantity === 0) {
                // Remove the entry object if position.quantity becomes 0
                const index = groupedData[timestamp][symbolKey].main.indexOf(position);
                if (index !== -1) {
                  groupedData[timestamp][symbolKey].main.splice(index, 1);
                }
              }
            }
          }
        });
      }
    });
  });
  for (const timestamp in groupedData) {
    for (const symbolKey in groupedData[timestamp]) {
      const mainQuantity =
        (groupedData[timestamp][symbolKey].main[0] || {}).quantity &&
        groupedData[timestamp][symbolKey].main[0].type === LegType.Stock;
      const othersLength = (groupedData[timestamp][symbolKey].others || []).length;

      if (typeof mainQuantity === "number" && mainQuantity === 0 && othersLength === 0) {
        // Delete the entire object if main quantity is 0 and others array is empty
        delete groupedData[timestamp][symbolKey];
      }
    }
  }
  return groupedData;
};

const callDiffTimeCallDiagnolSpreadrGrouping = (groupedData) => {
  let deleteRow = [];
  Object.keys(groupedData).forEach((timestamp) => {
    Object.keys(groupedData[timestamp]).forEach((symbolKey) => {
      let mainPositions = [];
      let shouldBreak = false;
      Object.keys(groupedData).forEach((timestamp2) => {
        Object.keys(groupedData[timestamp2]).forEach((symbolKey2) => {
          if (symbolKey === symbolKey2) {
            const othersArray = (groupedData[timestamp2][symbolKey2].others || []).filter(
              (position) => Object.keys(position).length > 0
            );
            const mainPosition = othersArray.find((position) => {
              return position.quantity > 0 && othersArray.length === 1 && position.type === LegType.Call;
            });
            if (shouldBreak) {
              return; // Exit the outer loop
            }
            if (mainPosition) {
              mainPositions.push({
                position: mainPosition,
                timestamp: timestamp2,
              });
              // Break out of both loops using the label
              shouldBreak = true;
            }
          }
        });
        if (shouldBreak) {
          return; // Exit the outer loop
        }
      });

      const groupedArrayRemovedEmpty = (groupedData[timestamp][symbolKey].others || []).filter(
        (position) => Object.keys(position).length > 0
      );
      const shortCallPositions =
        groupedArrayRemovedEmpty.length === 1
          ? (groupedData[timestamp][symbolKey].others || []).filter(
              (position) => position.type === LegType.Call && position.quantity < 0
            )
          : [];

      if (mainPositions.length > 0 && shortCallPositions.length > 0) {
        mainPositions.map((positionObj) => {
          const newPosition = { ...positionObj.position };
          let tempVar = false;
          if (positionObj.position?.quantity > Math.abs(shortCallPositions[0].quantity)) {
            positionObj.position.quantity = positionObj.position.quantity - Math.abs(shortCallPositions[0].quantity);
            newPosition.quantity = Math.abs(shortCallPositions[0].quantity);
            tempVar = false;
          } else if (positionObj.position?.quantity < Math.abs(shortCallPositions[0].quantity)) {
            tempVar = positionObj.position.quantity;
            positionObj.position.quantity = Number(
              -(Math.abs(shortCallPositions[0].quantity) - positionObj.position.quantity)
            );
          } else {
            deleteRow.push(positionObj.timestamp);
            tempVar = false;
          }
          groupedData[timestamp][symbolKey].others.unshift({ ...newPosition });

          if (tempVar) {
            groupedData[timestamp][symbolKey].others[1].quantity = Number(-tempVar);
          }

          if (shortCallPositions[0].strike === newPosition.strike) {
            groupedData[timestamp][symbolKey].main[0] = {
              ...groupedData[timestamp][symbolKey].main[0],
              descriptionId: 56,
              description: strategyName(56),
            };
          } else {
            groupedData[timestamp][symbolKey].main[0] = {
              ...groupedData[timestamp][symbolKey].main[0],
              descriptionId: 54,
              description: strategyName(54),
            };
          }
        });
      }
    });
  });
  deleteRow.map((row) => {
    delete groupedData[row];
  });
  return groupedData;
};

const callDiffTimePutDiagnolSpreadrGrouping = (groupedData) => {
  let deleteRow = [];
  Object.keys(groupedData).forEach((timestamp) => {
    Object.keys(groupedData[timestamp]).forEach((symbolKey) => {
      let mainPositions = [];
      let shouldBreak = false;
      Object.keys(groupedData).forEach((timestamp2) => {
        Object.keys(groupedData[timestamp2]).forEach((symbolKey2) => {
          if (symbolKey === symbolKey2) {
            const othersArray = (groupedData[timestamp2][symbolKey2].others || []).filter(
              (position) => Object.keys(position).length > 0
            );
            const mainPosition = othersArray.find((position) => {
              return position.quantity > 0 && othersArray.length === 1 && position.type === LegType.Put;
            });
            if (shouldBreak) {
              return; // Exit the outer loop
            }
            if (mainPosition) {
              mainPositions.push({
                position: mainPosition,
                timestamp: timestamp2,
              });
              // Break out of both loops using the label
              shouldBreak = true;
            }
          }
        });
        if (shouldBreak) {
          return; // Exit the outer loop
        }
      });

      const groupedArrayRemovedEmpty = (groupedData[timestamp][symbolKey].others || []).filter(
        (position) => Object.keys(position).length > 0
      );
      const shortPutPositions =
        groupedArrayRemovedEmpty.length === 1
          ? (groupedData[timestamp][symbolKey].others || []).filter(
              (position) => position.type === LegType.Put && position.quantity < 0
            )
          : [];

      if (mainPositions.length > 0 && shortPutPositions.length > 0) {
        mainPositions.map((positionObj) => {
          const newPosition = { ...positionObj.position };
          let tempVar = false;
          if (positionObj.position?.quantity > Math.abs(shortPutPositions[0].quantity)) {
            positionObj.position.quantity = positionObj.position.quantity - Math.abs(shortPutPositions[0].quantity);
            newPosition.quantity = Math.abs(shortPutPositions[0].quantity);
            tempVar = false;
          } else if (positionObj.position?.quantity < Math.abs(shortPutPositions[0].quantity)) {
            tempVar = positionObj.position.quantity;
            positionObj.position.quantity = Number(
              -(Math.abs(shortPutPositions[0].quantity) - positionObj.position.quantity)
            );
          } else {
            deleteRow.push(positionObj.timestamp);
            tempVar = false;
          }
          groupedData[timestamp][symbolKey].others.unshift({ ...newPosition });

          if (tempVar) {
            groupedData[timestamp][symbolKey].others[1].quantity = Number(-tempVar);
          }
          if (shortPutPositions.strike === newPosition.strike) {
            groupedData[timestamp][symbolKey].main[0] = {
              ...groupedData[timestamp][symbolKey].main[0],
              descriptionId: 57,
              description: strategyName(57),
            };
          } else {
            groupedData[timestamp][symbolKey].main[0] = {
              ...groupedData[timestamp][symbolKey].main[0],
              descriptionId: 55,
              description: strategyName(55),
            };
          }
        });
      }
    });
  });
  deleteRow.map((row) => {
    delete groupedData[row];
  });
  return groupedData;
};

const callDiffTimeIronCondorGrouping = (groupedData) => {
  let deleteRow = [];

  Object.keys(groupedData).forEach((timestamp) => {
    Object.keys(groupedData[timestamp]).forEach((symbolKey) => {
      let mainPositions = [];
      let shouldBreak = false;
      Object.keys(groupedData).forEach((timestamp2) => {
        Object.keys(groupedData[timestamp2]).forEach((symbolKey2) => {
          if (symbolKey === symbolKey2) {
            const othersArray = (groupedData[timestamp2][symbolKey2].others || []).filter(
              (position) => Object.keys(position).length > 0
            );
            // Initialize arrays to store positions with positive and negative quantities
            const positiveQuantityPositions = [];
            const negativeQuantityPositions = [];
            if (othersArray.length == 2) {
              othersArray.forEach((position) => {
                if (position.type === LegType.Put) {
                  if (position.quantity > 0) {
                    positiveQuantityPositions.push({
                      position,
                      timestamp: timestamp2,
                    });
                  } else if (position.quantity < 0) {
                    negativeQuantityPositions.push({
                      position,
                      timestamp: timestamp2,
                    });
                  }
                }
              });
              if (shouldBreak) {
                return; // Exit the outer loop
              }
            }

            // Check if we have one position with positive quantity and one with negative quantity
            if (positiveQuantityPositions.length === 1 && negativeQuantityPositions.length === 1) {
              mainPositions.push(positiveQuantityPositions[0]);
              mainPositions.push(negativeQuantityPositions[0]);
              shouldBreak = true;
            }
          }
        });

        if (shouldBreak) {
          return; // Exit the outer loop
        }
      });

      // Initialize arrays to store positions with positive and negative quantities
      const positiveQuantityPositions = [];
      const negativeQuantityPositions = [];
      const groupedArrayRemovedEmpty = (groupedData[timestamp][symbolKey].others || []).filter(
        (position) => Object.keys(position).length > 0
      );

      groupedArrayRemovedEmpty.forEach((position) => {
        if (position.type === LegType.Call) {
          if (position.quantity > 0) {
            positiveQuantityPositions.push(position);
          } else if (position.quantity < 0) {
            negativeQuantityPositions.push(position);
          }
        }
      });

      let shortCallPositions = [];

      // Check if we have one position with positive quantity and one with negative quantity
      if (positiveQuantityPositions.length === 1 && negativeQuantityPositions.length === 1) {
        shortCallPositions.push(positiveQuantityPositions[0]);
        shortCallPositions.push(negativeQuantityPositions[0]);
      }

      if (mainPositions.length === 2 && shortCallPositions.length === 2) {
        mainPositions.map((positionObj) => {
          const newPosition = { ...positionObj.position };
          const newPositionTemp = { ...positionObj.position }.expiration;
          newPositionTemp.setHours(0, 0, 0, 0);
          const groupedArrayRemovedEmptyTemp = {
            ...groupedArrayRemovedEmpty[0],
          }.expiration;
          groupedArrayRemovedEmptyTemp.setHours(0, 0, 0, 0);
          if (newPositionTemp.getTime() === groupedArrayRemovedEmptyTemp.getTime()) {
            groupedData[timestamp][symbolKey].main[0] = {
              ...groupedData[timestamp][symbolKey].main[0],
              descriptionId: 15,
              description: getStratergyNameForStrategyId(15),
            };

            groupedData[timestamp][symbolKey].others.unshift({
              ...newPosition,
            });
            deleteRow.push(positionObj.timestamp);
          } else if (newPositionTemp.getTime() === groupedArrayRemovedEmptyTemp.getTime()) {
          }
        });
      }
    });
  });
  deleteRow.map((row) => {
    delete groupedData[row];
  });

  return groupedData;
};

export const arrangeDataForTable = (data) => {
  const details =
    data?.map?.((position) => {
      const detail = getDetailsFromSymbol(position.symbol);
      return { ...position, ...detail };
    }) || [];
  const groupedData = getGroupedData(details);
  const groupedDataWithStrategyName = getStrategyNameFormLegs(groupedData);
  return groupedDataWithStrategyName;
};

function getGroupedData(data) {
  // Create an empty object to store the grouped data
  const groupedData = {};
  // Loop through the positions array and group data by date_acquired
  data?.forEach?.((position) => {
    const symbolDetails = getDetailsFromSymbol(position?.symbol);
    const timestamp = position?.date_acquired; // Extract timestamp

    const symbolKey = symbolDetails?.ticker || "defaultSymbol";

    if (!groupedData[timestamp]) {
      groupedData[timestamp] = {};
    }

    if (!groupedData[timestamp][symbolKey]) {
      groupedData[timestamp][symbolKey] = {
        main: [],
        others: [],
      };
    }
    if (position.type === LegType.Stock && !groupedData[timestamp][symbolKey].main.length) {
      groupedData[timestamp][symbolKey].main.push({ ...position });
    } else {
      let convertedString;
      if (position?.description) {
        convertedString = convertDateString(position?.description);
      } else {
        convertedString = "";
      }

      if (groupedData[timestamp][symbolKey].others?.length === 0) {
        if (groupedData[timestamp][symbolKey].main[0]) {
          groupedData[timestamp][symbolKey].others.push({
            ...groupedData[timestamp][symbolKey].main[0],
          });
        }
        groupedData[timestamp][symbolKey].main = [
          {
            symbol: symbolDetails?.ticker,
          },
        ];
      }
      if (position) {
        groupedData[timestamp][symbolKey].others.push({
          ...position,
          shortDescription: convertedString,
        });
      }
    }
  });
  const afterDiffTimeIronCondorGrouping = callDiffTimeIronCondorGrouping(groupedData);

  const afterDiffTimeCoveredGrouping = callDiffTimeCoveredGrouping(afterDiffTimeIronCondorGrouping);
  const afterDiffTimeCallDiagnolCalenderSpreadGrouping =
    callDiffTimeCallDiagnolSpreadrGrouping(afterDiffTimeCoveredGrouping);
  const afterDiffTimePutDiagnolCalenderSpreadGrouping = callDiffTimePutDiagnolSpreadrGrouping(
    afterDiffTimeCallDiagnolCalenderSpreadGrouping
  );

  // Convert the afterDiffTimePutDiagnolCalenderSpreadGrouping object to an array of groups
  let groupedArray = Object.values(afterDiffTimePutDiagnolCalenderSpreadGrouping).map((group) => {
    return Object.values(group).map((symbolGroup) => ({
      main: symbolGroup.main[0],
      others: symbolGroup.others.filter((obj) => Object.keys(obj || {}).length !== 0),
    }));
  });

  // Flatten the array of arrays and then group by main symbol
  let flatGroupedArray = groupedArray.flat();
  return flatGroupedArray; // Flatten the array of arrays
}

export const getStrategyNameFormLegs = (groupedData) => {
  const positionWithStratergy = groupedData?.map?.((position) => {
    let mainQuantity = 0;
    let avarage = 0;
    let totalCost_basis = 0;
    let todays_gain_loss_options = 0;
    let sumDelta = 0;
    let sumTheta = 0;
    let id = "";
    let invertment = 0;

    const legs = position?.others.map((other) => {
      mainQuantity = mainQuantity < Math.abs(other.quantity) ? Math.abs(other.quantity) : mainQuantity;
      other.ask = other.quantity > 0 ? other.ask : -1 * other.ask;
      other.bid = other.quantity > 0 ? other.bid : -1 * other.bid;
      const tempAvg = Number(other.ask && other.bid ? ((other.ask + other.bid) / 2).toFixed(2) : 0);
      avarage = avarage + tempAvg;
      totalCost_basis = Number(other.cost_basis ? totalCost_basis + other.cost_basis : 0);
      todays_gain_loss_options = todays_gain_loss_options + other.change;
      id = `${id}-${other.id}`;

      // sumDelta = sumDelta + (other?.greeks?.delta * 100 * (other.quantity < 0 ? -1 : 1));

      if (other.type === 2) {
        sumDelta = sumDelta + other?.quantity;
      } else {
        sumDelta = sumDelta + (other?.greeks?.delta ? other?.greeks?.delta * 100 * (other.quantity < 0 ? -1 : 1) : 0);
      }
      invertment = Math.abs(invertment - other.strike);

      sumTheta = sumTheta + (other?.greeks?.theta ? other?.greeks?.theta * 100 : 0);

      if (other.symbol) {
        const symbolDetails = getDetailsFromSymbol(other?.symbol);
        return {
          strike: symbolDetails?.strike,
          size: other.quantity,
          purchasePrice: other?.cost_basis,
          direction: other.quantity < 0 ? -1 : 1,
          type: symbolDetails?.type,
          expiration: symbolDetails?.expiration,
          symbol: other?.symbol,
          volatility: 0,
          range: "",
          indexOfStrikePrice: 0,
          index: 0,
        };
      }
    });
    const filteredLegs = legs.filter((item) => item !== undefined);
    if (filteredLegs.length) {
      const strategyKey = getStrategyIdFromLegs(filteredLegs);
      let response = getStratergyNameForStrategyId(strategyKey);
      if (!position.main.description) {
        position.main.description = response;
        position.main.descriptionId = strategyKey;
      }

      position.main.theta = sumTheta.toFixed(2);
      position.main.delta = sumDelta.toFixed(2);
      position.main.change = todays_gain_loss_options;
      if (totalCost_basis <= 0 || response?.toLowerCase().includes("short")) {
        position.main.quantity = -Math.abs(mainQuantity);
      } else {
        position.main.quantity = Math.abs(mainQuantity);
      }
      position.main.lastCustomValue = avarage.toFixed(2);

      position.main.cost_basis = totalCost_basis;
      position.main.secCost_basis = totalCost_basis ? (totalCost_basis / position.main.quantity)?.toFixed(2) : "-";
      position.main.id = id;
      const total_gain_loss = Number((avarage * 100 - totalCost_basis)?.toFixed(2));
      if (
        position.main.descriptionId === 9 ||
        position.main.descriptionId === 10 ||
        position.main.descriptionId === 11 ||
        position.main.descriptionId === 12
      ) {
        const invertmentTemp = (invertment - totalCost_basis / 100) * 100;
        position.main.roi = roiCalculationCreditSpread(total_gain_loss, invertmentTemp);
      } else {
        position.main.roi = total_gain_loss ? (total_gain_loss / totalCost_basis) * 100 : 0;
      }

      return position;
    }
    return position;
  });

  let symbolGroupedArray = positionWithStratergy?.reduce?.((acc, entry) => {
    const mainSymbol = entry.main.symbol;
    const existingSymbolArray = acc.find((group) => group.symbol === mainSymbol);

    if (!existingSymbolArray) {
      acc.push({ symbol: mainSymbol, entries: [entry] });
    } else {
      existingSymbolArray.entries.push(entry);
    }

    return acc;
  }, []);

  return symbolGroupedArray;
};

export const getTickerFromOptionSymbol = (symbol) => {
  return symbol.replace(symbol.slice(-15), "");
};

export const makeSummaryData = (seperatedData, symbolData) => {
  return seperatedData.map((item, index) => {
    const matchingObj = symbolData.find((obj2) => obj2.symbol === item.symbol);

    let parentMarketValue = 0;
    let parentDayLeft;
    let parentTodayGainLoss = 0;
    let parentTotalGainLoss = 0;
    let parentExitValue = 0;
    let parentDelta = 0;
    let parentCostBasis = 0;
    // let parentSecCostBasis = 0
    let parentDivDate = null;
    let parentEarningsDate = null;
    let parentTheta = 0;
    let parentDisplayQuantity;

    if (item.entries.length > 1) {
      parentDisplayQuantity = "Multiple";
    } else if (item.entries.length === 1) {
      parentDisplayQuantity = item.entries[0].main.type === 2 ? "Shares" : item.entries[0].main.description;
    }

    item.entries.map((entry, subIndex) => {
      // mainMarketValue value mean current current item market value
      let mainMarketValue = 0;
      let mainTotalGainLoss = 0;
      let mainDisplayQuantity = 0;
      let mainExitValue = 0;
      if (item.entries.length > 1) {
        mainDisplayQuantity = entry.main.type === 2 ? entry.main.quantity : entry.main.description;
      } else if (item.entries.length === 1) {
        mainDisplayQuantity =
          entry.main.type === 2
            ? entry.main.quantity
            : entry.main.descriptionId === 5
            ? 1
            : Math.abs(entry.main.quantity);
      }

      parentTodayGainLoss = parentTodayGainLoss + (entry?.main?.change || 0) * (entry?.main?.quantity || 0) || 0;

      const _deleta = Number(entry?.main?.delta ? entry?.main?.delta * entry.main.quantity : entry.main.quantity);
      parentDelta = parentDelta + (!isNaN(_deleta) ? _deleta : 0);
      parentTheta = parentTheta + (!isNaN(entry?.main?.theta) ? Number(entry?.main?.theta) : 0);

      parentCostBasis = parentCostBasis + entry.main?.cost_basis;

      let div_date = null;
      let earnings_date = null;
      earnings_date = getUpcomingEvent(entry.main?.calendars?.results);
      if (Array.isArray(entry?.main?.results)) {
        entry?.main?.results?.forEach((result) => {
          if (result?.tables?.cash_dividends) {
            result?.tables?.cash_dividends?.forEach((cash_dividend) => {
              const exDate = cash_dividend?.ex_date;
              if (exDate > div_date) {
                div_date = exDate;
              } else if (div_date === null) {
                div_date = exDate;
              }
            });
          }
        });
      }

      parentDivDate = div_date;
      parentEarningsDate = earnings_date;

      // if current item is stock then calculation based on formula
      // if current item is not stock then sum of other (child option stock)
      if (entry.main.type === 2) {
        const mark = (entry.main.ask + entry.main.bid) / 2;
        mainMarketValue = mark * entry.main.quantity;

        // total gain and loss
        mainTotalGainLoss = totalGainLossCalculation(mainMarketValue, entry.main.type, entry.main.cost_basis);
      }

      entry?.others?.map((expandRow, otherIndex) => {
        const expirationDate = new Date(expandRow.expiration_date);
        const currentDate = new Date();
        const millisecondsDiff = expirationDate.getTime() - currentDate.getTime();
        const daysDiff = Math.ceil(millisecondsDiff / (1000 * 60 * 60 * 24));
        const mark = (expandRow.ask + expandRow.bid) / 2;
        const mark_value =
          expandRow.type === 2 ? mark * Math.abs(expandRow.quantity) : mark * Math.abs(expandRow.quantity) * 100;
        const secCost_basis =
          expandRow.type === 2
            ? expandRow.cost_basis / Math.abs(expandRow.quantity)
            : expandRow.cost_basis / Math.abs(expandRow.quantity * 100);

        // here it's current item is not stock then calculating market value by using sum of child (for current item and for parent)
        if (entry.main.type !== 2) {
          mainMarketValue = mainMarketValue + mark_value;
          mainTotalGainLoss =
            mainTotalGainLoss + totalGainLossCalculation(mark_value, expandRow.type, expandRow.cost_basis);
        }

        if (typeof daysDiff !== "undefined" && daysDiff !== null && !isNaN(daysDiff)) {
          parentDayLeft =
            typeof parentDayLeft !== "undefined" && parentDayLeft !== null
              ? Math.min(daysDiff, parentDayLeft)
              : daysDiff;
        }

        const mainMark = (matchingObj?.ask + matchingObj?.bid) / 2;
        const extVlu = expandRow.strike < mainMark ? (mark - (mainMark - expandRow.strike)) * expandRow.quantity : mark;

        parentExitValue = parentExitValue + (extVlu || 0);
        mainExitValue = mainExitValue + (extVlu || 0);

        const total_gain_loss = totalGainLossCalculation(mark_value, expandRow.type, expandRow.cost_basis);

        item["entries"][subIndex]["others"][otherIndex]["mark_value"] = mark_value;
        item["entries"][subIndex]["others"][otherIndex]["total_gain_loss"] = total_gain_loss;
        item["entries"][subIndex]["others"][otherIndex]["secCost_basis"] = secCost_basis;
        if (
          item["entries"][subIndex]["main"].descriptionId !== 9 &&
          item["entries"][subIndex]["main"].descriptionId !== 10 &&
          item["entries"][subIndex]["main"].descriptionId !== 11 &&
          item["entries"][subIndex]["main"].descriptionId !== 12
        ) {
          item["entries"][subIndex]["others"][otherIndex]["roi"] = roiCalculation(
            total_gain_loss,
            expandRow?.cost_basis
          );
        } else {
          item["entries"][subIndex]["others"][otherIndex]["roi"] = roiCalculationCreditSpread(
            total_gain_loss,
            expandRow?.cost_basis
          );
        }

        item["entries"][subIndex]["others"][otherIndex]["exitValue"] = extVlu;
        item["entries"][subIndex]["others"][otherIndex]["change"] = expandRow.change * expandRow.quantity;
        item["entries"][subIndex]["others"][otherIndex]["delta"] = expandRow.delta * expandRow.quantity;
      });

      const mainSecCostBasis =
        entry.main.type === 2
          ? entry.main.cost_basis / entry.main.quantity
          : entry?.others.reduce((total, obj) => {
              return total + obj.secCost_basis;
            }, 0);

      // parentSecCostBasis = parentSecCostBasis + mainSecCostBasis;

      parentMarketValue = parentMarketValue + mainMarketValue;
      parentTotalGainLoss = parentTotalGainLoss + mainTotalGainLoss;

      item["entries"][subIndex]["main"]["mainDisplayQuantity"] =
        entry.main?.cost_basis < 0 && typeof mainDisplayQuantity === "number"
          ? -1 * mainDisplayQuantity
          : mainDisplayQuantity;
      item["entries"][subIndex]["main"]["mrk_value"] = mainMarketValue;
      item["entries"][subIndex]["main"]["total_gain_loss"] = mainTotalGainLoss;
      item["entries"][subIndex]["main"]["exitValue"] = mainExitValue;
      item["entries"][subIndex]["main"]["secCost_basis"] = mainSecCostBasis;
      if (
        item["entries"][subIndex]["main"].descriptionId !== 9 &&
        item["entries"][subIndex]["main"].descriptionId !== 10 &&
        item["entries"][subIndex]["main"].descriptionId !== 11 &&
        item["entries"][subIndex]["main"].descriptionId !== 12
      ) {
        item["entries"][subIndex]["main"]["roi"] = roiCalculation(mainTotalGainLoss, entry.main?.cost_basis);
      }
      item["entries"][subIndex]["main"]["change"] = entry.main.change * Math.abs(mainDisplayQuantity);
    });

    return {
      ...item,
      ask: matchingObj?.ask,
      bid: matchingObj?.bid,
      // quantity: parentQuantity,
      displayQuantity: parentDisplayQuantity,
      marketValue: parentMarketValue,
      dayLeft: parentDayLeft,
      todayGainLoss: parentTodayGainLoss,
      totalGainLoss: parentTotalGainLoss,
      roi: roiCalculation(parentTotalGainLoss, parentCostBasis),
      delta: (parentDelta || 0).toFixed(2),
      costBasis: parentCostBasis,
      // secCostBasis: parentSecCostBasis,
      exitValue: parentExitValue,
      divDate: parentDivDate,
      earningsDate: parentEarningsDate,
      theta: parentTheta,
    };
  });
};

const roiCalculation = (gainLoss, costBasis) => {
  if (!costBasis) {
    return 0;
  } else {
    return (gainLoss / Math.abs(costBasis)) * 100;
  }
};

const roiCalculationCreditSpread = (gainLoss, investment) => {
  if (!investment) {
    return 0;
  } else {
    return (gainLoss / Math.abs(investment)) * 100;
  }
};

export const addDollarSignCommasToNumber = (input) => {
  let value = parseFloat(input); // Convert to a number

  if (isNaN(value)) {
    return input;
  }
  return (value < 0 ? "-$" : "$") + addCommasToNumber(Math.abs(value).toFixed(2));
};

export const addSignAndCommasToNumber = (input) => {
  let value = parseFloat(input); // Convert to a number

  if (isNaN(value)) {
    return input;
  }
  return (value < 0 ? "-" : "") + addCommasToNumber(Math.abs(value).toFixed(2));
};

export const customToFixed = (num, decimalPlaces = 2) => {
  num = parseFloat(num); // Convert to a number
  return num.toFixed(decimalPlaces);
};

export const totalGainLossCalculation = (mrkValue, type, coastBasis) => {
  // if (type === 2) {
  return parseFloat(mrkValue) - parseFloat(coastBasis);
  // } else {
  //     return (parseFloat(mrkValue) * 100) - parseFloat(coastBasis)
  //     }
};

export const setSign = (number, signParameter) => {
  if (signParameter >= 0) {
    return Math.abs(number);
  } else {
    return -Math.abs(number);
  }
};

export const convertToTitleCase = (str) => {
  return str
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1))
    .join(" ");
};
