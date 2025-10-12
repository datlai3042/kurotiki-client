import React from "react";

type TProps = {
      value: string;
      name_radio: string;
      value_current: string | string[];
      callbackChecked?: () => void;
      getStateCheck?: (check: boolean) => void;
      checked: boolean;
};

const InputChecked = (props: TProps) => {
      const { value, value_current, checked, callbackChecked, getStateCheck } = props;
      const onChangeInput = () => {
            const inputChecked = value_current === value;
            getStateCheck && getStateCheck(inputChecked);
            callbackChecked && callbackChecked();
      };

      return (
            <div
                  className="group py-[.6rem] flex items-center gap-[2rem] rounded-lg hover:cursor-pointer hover:bg-color-main hover:text-[#fff]"
                  onClick={onChangeInput}
            >
                  <div className="min-w-[2rem] w-max h-[2.6rem] relative rounded-full flex items-center ">
                        <div className=" absolute z-[2] w-[2rem] aspect-square rounded-[1rem] bg-[#fff] flex items-center justify-center ml-[.6rem] border-[.1rem] border-gray-400">
                              {checked && <div className=" w-[50%] aspect-square rounded-full bg-color-main"></div>}
                              {!checked && <div className="hidden group-hover:block w-[50%] aspect-square rounded-full group-hover:bg-color-main bg-transparent"></div>}
                        </div>
                        {value_current && checked ? (
                              <div className="pl-[2rem] absolute min-w-[10rem] h-full bg-color-main rounded-full text-[#fff] flex items-center justify-center">
                                    <span className=" px-[2rem] text-[1.2rem] w-max">[{value}]</span>
                              </div>
                        ) : (
                              <span className="ml-[4rem] text-inherit group-hover:text-[#fff]">{value}</span>
                        )}
                  </div>
            </div>
      );
};

export default InputChecked;
