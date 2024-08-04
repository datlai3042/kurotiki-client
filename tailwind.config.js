/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: "jit",
	important: true,

	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
	theme: {
		extend: {
			gridTemplateRows: {
				// Simple 8 row grid
				16: "repeat(16, minmax(0, 1fr))",
				32: "repeat(2,minmax(0, 150px))",
				// Complex site-specific row configuration
				layout: "200px minmax(900px, 1fr) 100px",
			},
			borderRadius: {
				orderQuantity: "136px 20px 20px 20px;",
			},
			animation: {
				showSideBarAni: "showSideBar .8s linear ",
				hideSideBarAni: "hideSideBar 1s linear ",
				showToast: "toastAnimation 1s linear forwards",
				mountComponent: "mountComponent .5s",
				toastAnimation: "toastAnimation 1s",
				authBox: "authBox 1s",
				pulseCustome: " pulse 	1.5s ",
				scale: "scale .3s",
				cloudFly: "cloudFly  1s forwards ",
				rainDown: "rainDown  5s infinite",
				runLeft: "runLeft 1s",
				runTop: "runTop 1s",

				runRight: "runRight .8s infinite",
			},
			keyframes: {
				pulseCustome: {
					"50%": {
						opacity: 0.5,
					},
				},

				runTop: {
					"0%": { top: "-150%" },
					"100%": { top: 0 },
				},

				runLeft: {
					"0%": { right: "-150%" },
					"100%": { right: 0 },
				},

				runRight: {
					"0%": { left: "0%" },
					"100%": { left: "100%" },
				},

				cloudFly: {
					"0%": { top: "200%", left: "25px" },
					"100%": { top: "20%", scale: "3", left: "55px" },
				},

				rainDown: {
					"0%": { top: "-20%" },
					"10%": { top: "10%" },
					"20%": { top: "20%" },
					"30%": { top: "30%" },
					"40%": { top: "40%" },
					"50%": { top: "50%" },

					"60%": { top: "60%" },
					"80%": { top: "80%" },
					"90%": { top: "90%" },
					"150%": { top: "150%" },
				},

				showSideBar: {
					"0%": { transform: "translateX(-300px)" },
					"100%": { transform: "translateX(0px)" },
				},
				hideSideBar: {
					"0%": { transform: "translateX(0px)" },
					"100%": { transform: "translateX(-200px)" },
				},

				mountComponent: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},

				toastAnimation: {
					"0%": { right: "-200%" },
					"100%": { right: "0px" },
				},
				authBox: {
					"0%": { transform: "translateY(-100%)" },
					"100%": { transform: "translateY(0px)" },
				},

				scale: {
					"0%": { transform: "scale(0)" },
					"100%": { transform: "scale(1)" },
				},
			},
			boxShadow: {
				"3xl": "rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset",
			},
			colors: {
				main: "rgb(245, 245, 250)",
				bgTimeLine: "rgba(92, 167, 226,.1)",
				"toast-success": "var(--toast-success)",
				"toast-error": "var(--toast-error)",
				"toast-warning": "var(--toast-warning)",
			},
			fontFamily: {
				openSans: ["Open Sans"],
				poppins: ["Poppins"],
			},
		},
		screens: {
			dienThoai: "360px",
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
		},
	},
	plugins: [],
};
