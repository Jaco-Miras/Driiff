import { sortBy } from "lodash";

export const ascendingDeadline = (list, key) => {
  if (!key) key = "diff";
  return sortBy(list, key).reverse();
};

export const arrayRemove = (arr, value) => {
  return arr.filter(function (ele) {
    return ele !== value;
  });
};

export const arrayObjectGetKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

export const arrayObjectGetKeyByNameValue = (object, name, value) => {
  return Object.keys(object).find((key) => object[key][name] === value);
};

export const arrayUnique = (ar) => {
  let j = {};

  ar.forEach(function (v) {
    j[v + "::" + typeof v] = v;
  });

  return Object.keys(j).map(function (v) {
    return j[v];
  });
};

export const flat = (input, depth = 1, stack = []) => {
  for (let item of input) {
    if (item instanceof Array && depth > 0) {
      flat(item, depth - 1, stack);
    } else {
      stack.push(item);
    }
  }

  return stack;
};

if (!Array.prototype.flat) {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Array.prototype, "flat", {
    value: function (depth = 1, stack = []) {
      for (let item of this) {
        if (item instanceof Array && depth > 0) {
          item.flat(depth - 1, stack);
        } else {
          stack.push(item);
        }
      }

      return stack;
    },
  });
}

if (!Array.prototype.unique) {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Array.prototype, "unique", {
    value: function (attr = null) {
      let arr = [];
      for (let i = 0; i < this.length; i++) {
        if (attr === null) {
          if (!arr.includes(this[i])) {
            arr.push(this[i]);
          }
        } else {
          if (typeof arr.filter((a) => a[attr] === this[i][attr])[0] === "undefined") {
            arr.push(this[i]);
          }
        }
      }
      return arr;
    },
  });
}

export const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
};

export const groupObjByProp = (array, property) => {
  return array.reduce(function (acc, obj) {
    var key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
};

//need to check performance
export const uniq = (array, property) => {
  return array.reduce((acc, current) => {
    const x = acc.find((item) => item[property] === current[property]);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
};

export const uniqByProp = (array, property) => {
  return Array.from(
    array
      .reduce(
        (acc, item) => (item && item[property] && acc.set(item[property], item), acc), // using map (preserves ordering)
        new Map()
      )
      .values()
  );
};
