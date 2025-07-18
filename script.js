const apiKey = "d4b0d5b015ebbeb9db3b53a60504c28a";

    window.onload = function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          getWeatherByCoords(lat, lon);
        });
      }
    };

    function getWeatherByCity() {
      const city = document.getElementById("cityInput").value.trim();
      if (!city) {
        alert("Please enter a city name");
        return;
      }

      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(res => {
          if (!res.ok) throw new Error("City not found");
          return res.json();
        })
        .then(data => {
          const { lat, lon } = data.coord;
          getWeatherByCoords(lat, lon, city);
        })
        .catch(() => alert("City not found"));
    }

    function getWeatherByCoords(lat, lon, customCity = "") {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => {
          const temp = data.main.temp;
          const wind = data.wind.speed;
          const weather = data.weather[0];
          const description = weather.main;
          const iconURL = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
          const cityName = customCity || data.name;

          document.getElementById("cityName").textContent = cityName;
          document.getElementById("temp").textContent = temp;
          document.getElementById("wind").textContent = wind;
          document.getElementById("description").textContent = description;
          document.getElementById("icon").src = iconURL;

          document.getElementById("weatherText").classList.remove("d-none");

          setAppBackground(description);
        });
    }

    function setAppBackground(description) {
      const body = document.getElementById("appBody");
      body.className = "default";
      const iconArea = document.getElementById("bgIcons");
      iconArea.innerHTML = "";

      const classMap = {
        Clear: { class: "clear", icon: "☀️",},
        Clouds: { class: "cloudy", icon: "☁️",},
        Rain: { class: "rainy", icon: "🌧️",  },
        Drizzle: { class: "rainy", icon: "🌦️", },
        Thunderstorm: { class: "rainy", icon: "⛈️", background: "#87CEEB" },
        Snow: { class: "snowy", icon: "❄️", background: "#87CEEB" },
        Mist: { class: "misty", icon: "🌫️", background: "#87CEEB" },
      };

      const config = classMap[description] || { class: "default", icon: "🌡️" };
      body.classList.add(config.class);

      // add floating icons
      for (let i = 0; i < 30; i++) {
        const el = document.createElement("div");
        el.className = "floating-icon";
        el.textContent = config.icon;
        el.style.left = Math.random() * 100 + "%";
        el.style.animationDuration = (10 + Math.random() * 20) + "s";
        iconArea.appendChild(el);
      }
    }