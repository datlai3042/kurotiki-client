"use client";
import React, { useId } from "react";

type TProps = {
	placeholder: string;
	value: string;
};

const InputLayout = (props: TProps) => {
	const { placeholder, value } = props;

	const id = useId();

	return (
		<div className="flex flex-col w-full  min-h-[8rem] h-max gap-[.6rem]  ">
			<label htmlFor={`${id}`} className="first-letter:uppercase text-slate-700 font-semibold text-[1.4rem]">
				{placeholder}
			</label>
			<input
				id={`${id}`}
				className="w-full h-[60%] p-[.6rem_1.2rem] border-[.2rem] border-slate-300 bg-slate-50 focus:bg-[#ffffff] opacity-70 focus:opacity-100 rounded-[.6rem]  placeholder:text-[1.4rem] outline outline-[4px] outline-transparent focus:outline-blue-200 focus:border-transparent"
				placeholder={`Nhập ${placeholder} của bạn`}
			/>
		</div>
	);
};

export default InputLayout;
