import { reactive } from "vue";
import type { FormRules } from "element-plus";

export const REGEXP_PWD =
  /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){6,18}$/;

const loginRules = reactive(<FormRules>{
  password: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("Please enter password"));
        } /* else if (!REGEXP_PWD.test(value)) {
          callback(
            new Error(
              "The password format should be any combination of 6-18 digits, letters and symbols"
            )
          );
        }*/ else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

export { loginRules };
