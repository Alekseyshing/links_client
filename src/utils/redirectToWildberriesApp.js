function redirectToWildberriesApp(url) {
  // Redirect to the Wildberries app if it's installed, otherwise fallback to the Google Play Store page
  const wildberriesPackageName = 'com.wildberries.ru';
  if (navigator.getInstalledRelatedApps) {
    navigator.getInstalledRelatedApps().then((apps) => {
      if (apps.some((app) => app.id === wildberriesPackageName)) {
        window.location = `intent://${url.split('.ru/')[1]}#Intent;package=${wildberriesPackageName};scheme=https;end`;
        console.log('no app');
      } else {
        window.location = `https://play.google.com/store/apps/details?id=${wildberriesPackageName}`;
      }
    });
  } else {
    window.location = `https://play.google.com/store/apps/details?id=${wildberriesPackageName}`;
  }
}


export default redirectToWildberriesApp
