// for form validation
export function validateIsNumber(rule, value, callback) {
  let num = Number(value);
  if (isNaN(num)) {
    callback(new Error('请输入数字'))
  } else {
    callback();
  }
}

// 大于0 自定义表单校验器
export const gt0Validator = (rule,value,callback) => {
  if(Number(value) > 0) {
    callback();
  } else {
    callback(new Error(rule.message));
  }
}

// 小于x
export const ltValidator = (rule,value,callback) => {
  if(Number(value) < Number(rule.max)) {
    callback();
  } else {
    callback(new Error(rule.message));
  }
}
// 小于等于x
export const lteqValidator = (rule,value,callback) => {
  if(Number(value) <= Number(rule.max)) {
    callback();
  } else {
    callback(new Error(rule.message));
  }
}

// 小数点后位数 自定义表单校验器
export const lengthAfterZero = (rule,value,callback) => {
  const len = rule.len;
  if(new String(value).indexOf('.') > 0) {
    const lenAfterZero = new String(value).slice(new String(value).indexOf('.') + 1);
    if(lenAfterZero.length <= len) {
      callback();
    } else {
      callback(new Error(rule.message));
    }
  }
  callback();
}

// 匹配数字和字母
export const onlyNumberAndEnglish = (rule,value,callback) => {
  const regex = /^[a-zA-Z0-9]+$/;
  if(regex.test(value)) {
    callback();
  } else {
    callback(new Error(rule.message));
  }
  callback();
}

export const checkPhoneAllowEmpty = (rule,value,callback) => {
  const regex = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
  if(value === null || value === '' || regex.test(value)) {
    callback();
  } else {
    callback(new Error(rule.message));
  }
  callback();
}

