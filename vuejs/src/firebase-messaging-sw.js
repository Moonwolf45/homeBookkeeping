import { onBackgroundMessage } from 'firebase/messaging/sw'
import { initializeApp } from 'firebase/app'
import { getMessaging, isSupported } from 'firebase/messaging/sw'

try {
  const app = initializeApp({
    apiKey: "AIzaSyBLfIKBKNQ-v4vOdCMnDH28FHbo9Pn_qn4",
    authDomain: "homebookkeeping-a1eb2.firebaseapp.com",
    projectId: "homebookkeeping-a1eb2",
    storageBucket: "homebookkeeping-a1eb2.appspot.com",
    messagingSenderId: "930154418965",
    appId: "1:930154418965:web:0be85a050dbfba00460f1c",
    measurementId: "G-DB4P6TCFZM"
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim())
  })

  isSupported().then(() => {
    const messaging = getMessaging(app)

    onBackgroundMessage(messaging, ({ notification, data }) => {
      console.log("[firebase-messaging-sw.js] Received background message ", notification);

      // Customize notification here
      const notificationTitle = notification.title;
      const notificationOptions = {
        body: notification.body,
        icon: data.icon,
        image: notification.image,
        requireInteraction: true,
        click_action: data.click_action
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    })
  })

  // self.addEventListener('notificationclick', function(event) {
  //   // извлекаем адрес перехода из параметров уведомления
  //   const target = event.notification.data.click_action || '/';
  //   event.notification.close();
  //
  //   // этот код должен проверять список открытых вкладок и переключатся на открытую
  //   // вкладку с ссылкой если такая есть, иначе открывает новую вкладку
  //   event.waitUntil(clients.matchAll({
  //     type: 'window',
  //     includeUncontrolled: true
  //   }).then(function(clientList) {
  //     // clientList почему-то всегда пуст!?
  //     for (let i = 0; i < clientList.length; i++) {
  //       let client = clientList[i];
  //       if (client.url == target && 'focus' in client) {
  //         return client.focus();
  //       }
  //     }
  //
  //     // Открываем новое окно
  //     return clients.openWindow(target);
  //   }));
  // });
  //
  // messaging.onBackgroundMessage((payload) => {
  //   console.log("[firebase-messaging-sw.js] Received background message ", payload);
  //
  //   // Customize notification here
  //   const data = { ...payload.notification, ...payload.data };
  //   const notificationTitle = data.title;
  //   const notificationOptions = {
  //     body: data.body,
  //     icon: data.icon,
  //     image: data.image,
  //     requireInteraction: true,
  //     click_action: data.click_action,
  //     data
  //   };
  //
  //   self.registration.showNotification(notificationTitle, notificationOptions);
  // });
} catch (e) {
  console.log(e);
}
