import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    GetFCMToken();
  }
}

async function GetFCMToken (){

  let fcmtoken = await AsyncStorage.getItem("fcmtoken");
  console.log(fcmtoken,'old');
  if(!fcmtoken){
    try{
      const fcmtoken = await messaging().getToken();
      if(fcmtoken){
        console.log(fcmtoken,"fcm token");
        await AsyncStorage.setItem('fcmtoken',fcmtoken)
      }
    }
    catch (e){
      console.log('error is',e )
    }
  }
}

export const  NotificationListener =()=>{
 // Assume a message-notification contains a "type" property in the data payload of the screen to open

 messaging().onNotificationOpenedApp(remoteMessage => {
  console.log(
    'Notification caused app to open from background state:',
    remoteMessage.notification,
  );
 });
 // Check whether an initial notification is available
 messaging()
 .getInitialNotification()
 .then(remoteMessage => {
   if (remoteMessage) {
     console.log(
       'Notification caused app to open from quit state:',
       remoteMessage.notification,
     );
   }
 });
 messaging().onMessage(async remoteMessage =>{
  console.log('Notifications on foreground state------>',remoteMessage)
 })
}