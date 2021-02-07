# pwa-experiment

https://tuhub.ru/posts/progressive-web-app-with-react

```sh
npm i react-router-dom
```

https://pwa-experiment-2405f.web.app/

Progressive Web Apps это разрекламированное будущее интернета. Давайте разработаем такое приложение!

Google продвигает PWA как решение многих проблем современного веба - в частности вопросов связанных с мобильными пользователями: https://developers.google.com/web/progressive-web-apps/.

Progressive Web App - это по сути быстрые, ориентированные на производительность веб-приложения, которые специальным образом подготовлены для мобильных устройств. Также их можно сохранить на домашнем экране вашего смартфона, а оттуда они будут выглядеть и чувствовать себя как нативные приложения (включая оффлайн особенности и Push уведомления).

Крупные игроки, такие как Twitter или Flipboard недавно запустили свои PWA, которые можно попробовать посетив с мобильного устройства страницы http://flipboard.com или https://lite.twitter.com/.

В этой статье, мы будем разрабатывать простое PWA с помощью React, которое даст нам шаблон для разработки более сложных приложений.
Для начала, давайте создадим базовое React приложение с помощью create-react-app.

Перейдите в каталог в котором вы будете хранить ваше приложение и запустите следующие команды:
```sh
npm install -g create-react-app
create-react-app pwa-experiment
```
Теперь давайте установим React Router:
```sh
cd pwa-experiment
npm install --save react-router@3.0.5
```
Наконец, скопируйте этот код в файл App.js. Он даст нам простой макет страницы с навигацией:
```sh
import React, { Component } from 'react';
import { Router, browserHistory, Route, Link } from 'react-router';
import logo from './logo.svg';
import './App.css';

const Page = ({ title }) => (
  <div className="App">
    <div className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h2>{title}</h2>
    </div>
    <p className="App-intro">
      This is the {title} page.
    </p>
    <p>
      <Link to="/">Home</Link>
    </p>
    <p>
      <Link to="/about">About</Link>
    </p>
    <p>
      <Link to="/settings">Settings</Link>
    </p>
  </div>
);

const Home = (props) => (
  <Page title="Home"/>
);

const About = (props) => (
  <Page title="About"/>
);

const Settings = (props) => (
  <Page title="Settings"/>
);

class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Home}/>
        <Route path="/about" component={About}/>
        <Route path="/settings" component={Settings}/>
      </Router>
    );
  }
}

export default App;
```
Запустите npm start чтобы протестировать ваше приложение. Смотреть ещё нечего, но для наших целей это хорошее начало. Давайте начнём конвертировать всё это в Progressive Web App.

1. Установка Lighthouse
Lighthouse - это бесплатный инструмент от Google, который оценивает ваше приложение на основе чек листа PWA. https://developers.google.com/web/tools/lighthouse/.

Давайте установим его в Chrome, а после этого оценим нашем приложение. Вы можете запустить аудит Lighthouse кликнув по иконке в правом верхнем углу браузера, а затем нажав на кнопку "Generate Report".
![Lighthouse](https://tuhub.ru/sites/default/files/inline-images/1-V6PeCwLINQCTumMaKGlIpg.png)
Упс.

Пока что наше приложение быстрое (так как у нас очень мало контента), но оно проваливается в большинстве ключевых областей.

Вы можете увидеть чек лист, который используется в Lighthouse здесь: https://developers.google.com/web/progressive-web-apps/checklist.

Давайте работать с проблемами по порядку.

2. Настройка Service Worker
Service worker - это JavaScript код, который находится между нашим приложением и сетью. Мы будем использовать его для перехвата сетевых запросов и обслуживания закэшированных файлов - это позволит нашему приложению работать оффлайн.

Чтобы начать работу с Service Worker'ом, нам необходимо сделать 3 вещи:

Создать файл service-worker.js в папке public;
Зарегистрировать worker через наш index.js;
Настроить кэширование;
Давайте сделаем это.

Первый шаг довольно понятен. В папке pwa-experiment/public, создаём пустой JavaScript файл названный service-worker.js.

Второй шаг немного запутаннее. Мы хотим проверить если браузер поддерживает service worker'ы, и тогда регистрировать его с помощью service-worker.js.

Чтобы сделать это, давайте добавим тег script в файл public/index.html.
```sh
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('service-worker.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
          }).catch(function(err) {
            console.log(err)
          });
        });
      } else {
        console.log('service worker is not supported');
      }
    </script>
  </body>
</html>
```
Этот код очень простой - если браузер поддерживает его, то мы ждём пока страница загрузится, а после этого регистрируем наш Service Worker загружая файл service-worker.js.
Завершающий шаг: Настройка кэширования!

Мы собираемся скопировать настройки Service Worker'а отсюда написанные Addy Osmani, а также отключим кэширование в целях разработки (и предпримем меры удаления всего кэша, когда Service Worker инициализируется).
В public/service-worker.js:
```sh
// Set this to true for production
var doCache = false;

// Name our cache
var CACHE_NAME = 'my-pwa-cache-v1';

// Delete old caches that are not our current one!
self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(keyList =>
        Promise.all(keyList.map(key => {
          if (!cacheWhitelist.includes(key)) {
            console.log('Deleting cache: ' + key)
            return caches.delete(key);
          }
        }))
      )
  );
});

// The first time the user starts up the PWA, 'install' is triggered.
self.addEventListener('install', function(event) {
  if (doCache) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          // Get the assets manifest so we can see what our js file is named
          // This is because webpack hashes it
          fetch("asset-manifest.json")
            .then(response => {
              response.json()
            })
            .then(assets => {
              // Open a cache and cache our files
              // We want to cache the page and the main.js generated by webpack
              // We could also cache any static assets like CSS or images
              const urlsToCache = [
                "/",
                assets["main.js"]
              ]
              cache.addAll(urlsToCache)
              console.log('cached');
            })
        })
    );
  }
});

// When the webpage goes to fetch files, we intercept that request and serve up the matching files
// if we have them
self.addEventListener('fetch', function(event) {
    if (doCache) {
      event.respondWith(
          caches.match(event.request).then(function(response) {
              return response || fetch(event.request);
          })
      );
    }
});
```
Перезапустите ваше приложение с помощью npm run start и вы должны увидеть следующее в консоле:
![Home](https://tuhub.ru/sites/default/files/inline-images/1-jdfnTvtUSvaohYy-PZWXQw.png)
Для более подробной дискуссии на тему Service Worker'ов, посмотрите это https://medium.com/@addyosmani/progressive-web-apps-with-react-js-part-3-offline-support-and-network-resilience-c84db889162c.

Давайте закроем консоль и запустим аудит Lighthouse снова:
![Web](https://tuhub.ru/sites/default/files/inline-images/1-nZInBhvGwAP-oort56NHWw.png)
Мы делаем успехи! Теперь у нас есть зарегистрированный Service Worker. Так как у нас отключено кэширование, вторая галочка ещё не отмечена, но как только мы включим кэширование она будет работать!

3. Добавление прогрессивных улучшений
Прогрессивные улучшения в основном означают, что сайт будет работать без загрузки любого JavaScript кода.

Прямо сейчас, файл index.html отображает пустой div (#root), который подхватывает наше React приложение.

Вместо этого, мы хотим отображать какой-то базовый HTML и CSS, ещё до того как React приложение будет инициализировано.

Самый простой способ сделать это - переместить некоторые из наших основных HTML структур в этот самый div#root. Этот HTML будет перезаписан как только ReactDOM отобразит компонент App, но покажет пользователю что-то вместо пустой страницы на которую пришлось бы глазеть пока загружается bundle.js.

Вот наш новый index.html. Обратите внимание, что стили находятся в head, а HTML в div#root.
```sh
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    <title>React App</title>
    <!-- Add in some basic styles for our HTML -->
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
      }
      .App {
        text-align: center;
      }
      .App-header {
        background-color: #222;
        height: 150px;
        padding: 20px;
        color: white;
      }
      .App-intro {
        font-size: large;
      }
    </style>
  </head>
  <body>
    <!-- Filler HTML as our app starts up -->
    <div id="root">
      <div class="App">
      <div class="App-header">
        <h2>Home</h2>
      </div>
      <p class="App-intro">
        Loading site...
      </p>
    </div>
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('service-worker.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
          }).catch(function(err) {
            console.log(err)
          });
        });
      } else {
        console.log('service worker is not supported');
      }
    </script>
  </body>
</html>
});
```
(Кстати, теперь мы можем удалить дубликаты стилей в App.css и index.css - просто чтобы сделать код чище.)

Одобрит ли это Lighthouse?
![Light](https://tuhub.ru/sites/default/files/inline-images/1-znpXu5xiIU_AAfBaPWColQ.png)

4. Возможность добавления на домашний экран
Мы можем пропустить требования касающиеся HTTPS - которые будут учтены после деплоя.

Ну а сейчас о том, что делает Progressive Web App действительно особенными: возможность пользователя сохранить его на свой домашний экран и открывать его как приложение.

Чтобы это сделать, нам нужно добавить файл manifest.json в папку public.
```sh
{
  "short_name": "My First PWA",
  "name": "My First Progressive Web App",
  "icons": [
    {
      "src":"icon.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ],
  "start_url": "/?utm_source=homescreen",
  "background_color": "#222",
  "theme_color": "#222",
  "display": "standalone"
}
```
Если у вас нету значка, то можете использовать этот (любезность моей компании MuseFind), или создайте свой собственный (должен быть 192 на 192 пикселя):

![Muse](https://tuhub.ru/sites/default/files/inline-images/1-W9RHL8akNvH-FUGwQgCUNw.png)

Добавьте icon.png и manifest.json в папку public, а также добавьте следующие строки в ваш index.html файл:
```sh
 <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    <!-- Add manifest -->
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
    <!-- Tell the browser it's a PWA -->
    <meta name="mobile-web-app-capable" content="yes">
    <!-- Tell iOS it's a PWA -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <!-- Make sure theme-color is defined -->
    <meta name="theme-color" content="#536878">
    <title>React App</title>
  </head>
    ```
 Хорошо, что теперь мы делаем?
 Всё что нам не хватает, это кэширование и HTTPS.
 
 5. Деплой через Firebase
 Во-первых, включите кэширование. Измените doCache на true в файле service-worker.js.

После этого, в консоле Firebase создайте новый проект и назовите его pwa-experiment.

Вернитесь в папку с проектом и запустите следующее:
```sh
npm install -g firebase-tools
firebase login
firebase init
```
После того как вы пройдёте авторизацию и начнётся инициализация: ответьте на следующие вопросы:

Когда он спросит What Firebase CLI features do you want to setup for this directory?, с помощью пробела снимете галочки везде кроме "Hosting".

Нажмите Enter, а после этого выберите pwa-experiment в качестве проекта.

Когда он спросит What do you want to use as your public directory?, наберите на клавитуре "build" и нажмите Enter.

На вопрос про одностраничное приложение, выберите "No".

После этого процесс должен завершиться. Теперь можно запустить команду:
```sh
npm run build && firebase deploy
```
Это соберёт наш проект в папку build, которую Firebase будет деплоить.

Firebase вернёт нам URL. Давайте откроем его в Chrome и запустим аудит Lighthouse в заключительный раз.
![Google](https://tuhub.ru/sites/default/files/inline-images/1-je-cDo1IJOQ_aqSXLM9-JA.png)
Мы сделали это!

Ну и в качестве завершающего теста, откройте этот URL на вашем телефоне и попробуйте сохранить его на домашний экран. После открытия его с домашнего экрана, он должен выглядеть как нативное приложение.

Вся суть Progressive Web App - скорость. В этой статье мы пропустили много всего связанного с улучшением производительности, так как наше приложение было скелетным.

Однако, по мере роста вашего приложения, файл main.js будет увеличиваться и увеличиваться, и Lighthouse будет всё меньше и меньше доволен вами.

Следите за нами, чтобы не пропустить углублённую статью об оптимизации производительности с помощью React и React Router, которая будет применима как и для Progressive Web App так и для старомодных веб-приложений.

Теперь у нас есть рабочий скелет для разработки PWA и мы готовы к будущему веб-приложений.
