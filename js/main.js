// Router

var home = Vue.component("home", {
	template: "#home"
})

var registration = Vue.component("registration", {
	template: "#registration"
})

var login = Vue.component("login", {
	template: "#login"
})

var pointOfIssue = Vue.component("point-of-issue", {
	data() {
		return {
			cities: ["Москва", "Санкт-Петербург"],
			city: "",
			country: "Россия",
			selectedPoint: false,
			point: {
				address: "",
				phone: "",
				worktime: "",
				metro: ""
			},
			field: ""
		}
	},
	methods: {
		selectPoint() {
			if(this.checkField()) {
				document.getElementById("widget-cdek").innerHTML = ""; // так себе идея
				document.getElementById("widget-cdek").style.display = "block"; // так себе идея
				var self = this;
				var widgetCDEK = new ISDEKWidjet ({
					defaultCity: this.city, //какой город отображается по умолчанию
					cityFrom: 'Омск', // из какого города будет идти доставка
					country: this.country, // можно выбрать страну, для которой отображать список ПВЗ
					link: 'widget-cdek', // id элемента страницы, в который будет вписан виджет
					path: 'https://widget.cdek.ru/widget/scripts/', //директория с библиотеками виджета
					servicepath: 'https://yaroslav-i.ru/dev/vue-weship2you.com/widget/cdek/service.php', //ссылка на файл service.php на вашем сайте
					apikey: '9e0df4da-9236-4707-8074-80729a55cac0', // ключ для корректной работы Яндекс.Карт, получить необходимо тут,
					onChoose: onChoose
				});
				this.selectedPoint = false;
				this.point.address = ""
				this.point.phone = "";
				this.point.worktime = "";
				this.point.metro = "";

				function onChoose(data) {
					self.point.address = data.PVZ.Address;
					self.point.phone = data.PVZ.Phone;
					self.point.worktime = data.PVZ.WorkTime;
					self.point.metro = data.PVZ.Metro;
					self.selectedPoint = true;
					document.getElementById("widget-cdek").innerHTML = ""; // так себе идея
					document.getElementById("widget-cdek").style.display = "none";
				}
			} else {
				this.field = "empty-field";

				setTimeout(() => this.field = "", 1000)
			}
		},
		checkField() {
			return this.city.length === 0 ? false : true;
		}
	},
	template: "#select-point"
})

var routes = [
  { path: '/', component: home },
  { path: '/registration', component: registration },
  { path: '/login', component: login },
  { path: '/select-point', component: pointOfIssue }
]

var router = new VueRouter({ routes })

// App

var app = new Vue({
	el: "#app",
	data: {
		user: {
			login: "",
			password: "",
			authorized: false
		},
		reСaptchaToken: "6Lf3-GIUAAAAAESEwWz-5W2LDhyAVbtsL-9KHkGt",
		api: {
			url: "https://weship2you.com/api/api",
			data: {
				api_key: "0274696aa30f21c",
				link_id: 0,
				name	: "",
				email: "",
				password: "",
				user_id: 0,
				version: ""
			},
			hash: ""
		}
	},
	methods: {
		request(url, params) {
			return new Promise((resolve, reject) => {
				return fetch(url, {
					method: "POST",
					body: JSON.stringify(params)
				}).then(
					result => {
						return result.json();
					}
				).then(
					result => {
						if(result.errors === undefined) {
							this.api.hash = result.data.api_hash;
						}

						resolve();

						return result;
					}
				).catch(error => {
					//resolve();
				})
			})
		},
		init(url) {
			return this.request(this.api.url, this.api.data);
		},
		registration() {
			this.init().then(() => {
				this.request(`${this.api.url}/signup`, {
					api_hash: this.api.hash,
					credentials: {
						regEmail: this.user.login,
						regPassword: this.user.password
					},
					responseToken: this.reСaptchaToken,
					link_id: 0
				})
			})
			
		},
		login() {
			this.request(`${this.api.url}/signin`, {
				api_hash: this.api.hash,
				credentials: {
					authEmail: this.user.login,
					authPassword: this.user.password
				},
				time_zone: (new Date().getTimezoneOffset() / 60) * (-1)
			})
		},
		logout() {
			this.request(`${this.api.url}/signout`, {
				api_hash: this.api.hash
			})
		}
	},
	router: router
})