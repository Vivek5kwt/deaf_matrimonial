#import "AppDelegate.h"

#import <React/RCTAppSetupUtils.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

// ✅ Firebase & Notifications
#import <Firebase.h>
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // ✅ Firebase init
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }

  // ✅ Prepare React Native New Architecture setup
  RCTAppSetupPrepareApp(application);

  // ✅ Create root view using Fabric (New Arch)
  self.moduleName = @"deaf_matrimonial"; // 👈 use your module name (same as in index.js)
  self.initialProps = @{};

  BOOL didFinish = [super application:application didFinishLaunchingWithOptions:launchOptions];

  // ✅ Setup window
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = self.window.rootViewController.view;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  // ✅ Notification delegate
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  return didFinish;
}

#pragma mark - Push Notifications

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNNotificationPresentationOptionAlert |
                    UNNotificationPresentationOptionSound |
                    UNNotificationPresentationOptionBadge);
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
  completionHandler();
}

- (void)application:(UIApplication *)application
didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

@end
