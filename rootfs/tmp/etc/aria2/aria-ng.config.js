/*!
 * AriaNg
 * https://github.com/mayswind/AriaNg
 */
!(function () {
  'use strict';
  var e, t, a;
  if (
    ((e = navigator.appName),
    (t = navigator.appVersion.split(';')),
    (a = t && 1 < t.length ? t[1].replace(/[ ]/g, '') : ''),
    'Microsoft Internet Explorer' === e &&
      ('MSIE6.0' === a ||
        'MSIE7.0' === a ||
        'MSIE8.0' === a ||
        'MSIE9.0' === a))
  ) {
    var n = document.createElement('div');
    (n.className = 'alert alert-danger'),
      (n.innerHTML =
        'Sorry, AriaNg cannot support this browser, please upgrade your browser!'),
      document.getElementById('content-wrapper').appendChild(n);
  }
})(),
  (function () {
    'use strict';
    var e = function () {
      var e = $(window).height(),
        t = $('.main-header').outerHeight() + $('.main-footer').outerHeight();
      $('.content-body').css('height', e - t);
    };
    $(window, '.wrapper').resize(function () {
      e(),
        setInterval(function () {
          e();
        }, 1);
    }),
      e();
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg', [
      'ngRoute',
      'ngSanitize',
      'ngTouch',
      'ngMessages',
      'ngCookies',
      'ngAnimate',
      'pascalprecht.translate',
      'angularMoment',
      'ngWebSocket',
      'utf8-base64',
      'LocalStorageModule',
      'ui-notification',
      'angularBittorrentPeerid',
      'cgBusy',
      'angularPromiseButtons',
      'oitozero.ngSweetAlert',
      'angular-clipboard',
      'inputDropdown',
      angularDragula(angular),
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').config([
      '$routeProvider',
      function (e) {
        e.when('/downloading', {
          templateUrl: 'views/list.html',
          controller: 'DownloadListController',
        })
          .when('/waiting', {
            templateUrl: 'views/list.html',
            controller: 'DownloadListController',
          })
          .when('/stopped', {
            templateUrl: 'views/list.html',
            controller: 'DownloadListController',
          })
          .when('/new', {
            templateUrl: 'views/new.html',
            controller: 'NewTaskController',
          })
          .when('/new/:url', { template: '', controller: 'CommandController' })
          .when('/task/detail/:gid', {
            templateUrl: 'views/task-detail.html',
            controller: 'TaskDetailController',
          })
          .when('/settings/ariang', {
            templateUrl: 'views/settings-ariang.html',
            controller: 'AriaNgSettingsController',
          })
          .when('/settings/ariang/:extendType', {
            templateUrl: 'views/settings-ariang.html',
            controller: 'AriaNgSettingsController',
          })
          .when('/settings/aria2/basic', {
            templateUrl: 'views/settings-aria2.html',
            controller: 'Aria2SettingsController',
          })
          .when('/settings/aria2/http-ftp-sftp', {
            templateUrl: 'views/settings-aria2.html',
            controller: 'Aria2SettingsController',
          })
          .when('/settings/aria2/http', {
            templateUrl: 'views/settings-aria2.html',
            controller: 'Aria2SettingsController',
          })
          .when('/settings/aria2/ftp-sftp', {
            templateUrl: 'views/settings-aria2.html',
            controller: 'Aria2SettingsController',
          })
          .when('/settings/aria2/bt', {
            templateUrl: 'views/settings-aria2.html',
            controller: 'Aria2SettingsController',
          })
          .when('/settings/aria2/metalink', {
            templateUrl: 'views/settings-aria2.html',
            controller: 'Aria2SettingsController',
          })
          .when('/settings/aria2/rpc', {
            templateUrl: 'views/settings-aria2.html',
            controller: 'Aria2SettingsController',
          })
          .when('/settings/aria2/advanced', {
            templateUrl: 'views/settings-aria2.html',
            controller: 'Aria2SettingsController',
          })
          .when('/settings/rpc/set', {
            template: '',
            controller: 'CommandController',
          })
          .when('/settings/rpc/set/:protocol/:host/:port/:interface/:secret?', {
            template: '',
            controller: 'CommandController',
          })
          .when('/debug', {
            templateUrl: 'views/debug.html',
            controller: 'AriaNgDebugController',
          })
          .when('/status', {
            templateUrl: 'views/status.html',
            controller: 'Aria2StatusController',
          })
          .otherwise({ redirectTo: '/downloading' });
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').run([
      '$window',
      '$rootScope',
      '$location',
      '$document',
      'ariaNgCommonService',
      'ariaNgLocalizationService',
      'ariaNgLogService',
      'ariaNgSettingService',
      'aria2TaskService',
      function (a, n, s, o, t, i, r, l, e) {
        var c = !1,
          d = function (e, t) {
            return (
              e === t ||
              (0 === t.indexOf(e) && 0 === t.substring(e.length).indexOf('/'))
            );
          },
          u = function () {
            (n.currentTheme = 'light'),
              angular.element('body').removeClass('theme-dark');
          },
          p = function () {
            (n.currentTheme = 'dark'),
              angular.element('body').addClass('theme-dark');
          },
          g = function () {
            if (l.isBrowserSupportDarkMode()) {
              var e = a.matchMedia('(prefers-color-scheme: dark)');
              r.info(
                '[root.setThemeBySystemSettings] system uses ' +
                  (e.matches ? 'dark' : 'light') +
                  ' theme'
              ),
                e.matches ? p() : u();
            } else g();
          },
          f = function () {
            angular
              .element('body')
              .addClass('sidebar-collapse')
              .removeClass('sidebar-open');
          };
        ((n.currentTheme = 'dark'),
        (n.searchContext = { text: '' }),
        (n.taskContext = {
          rpcStatus: 'Connecting',
          list: [],
          selected: {},
          enableSelectAll: !1,
          getSelectedTaskIds: function () {
            var e = [];
            if (!this.list || !this.selected || this.list.length < 1) return e;
            for (var t = 0; t < this.list.length; t++) {
              var a = this.list[t];
              this.selected[a.gid] && e.push(a.gid);
            }
            return e;
          },
          getSelectedTasks: function () {
            var e = [];
            if (!this.list || !this.selected || this.list.length < 1) return e;
            for (var t = 0; t < this.list.length; t++) {
              var a = this.list[t];
              this.selected[a.gid] && e.push(a);
            }
            return e;
          },
          isAllSelected: function () {
            for (var e = !0, t = 0; t < this.list.length; t++) {
              var a = this.list[t];
              if (n.filterTask(a) && !this.selected[a.gid]) {
                e = !1;
                break;
              }
            }
            return e;
          },
          hasRetryableTask: function () {
            for (var e = 0; e < this.list.length; e++) {
              var t = this.list[e];
              if (n.filterTask(t) && n.isTaskRetryable(t)) return !0;
            }
            return !1;
          },
          hasCompletedTask: function () {
            for (var e = 0; e < this.list.length; e++) {
              var t = this.list[e];
              if (n.filterTask(t) && 'complete' === t.status) return !0;
            }
            return !1;
          },
          selectAll: function () {
            if (
              this.list &&
              this.selected &&
              !(this.list.length < 1) &&
              this.enableSelectAll
            )
              for (
                var e = this.isAllSelected(), t = 0;
                t < this.list.length;
                t++
              ) {
                var a = this.list[t];
                n.filterTask(a) && (this.selected[a.gid] = !e);
              }
          },
          selectAllFailed: function () {
            if (
              this.list &&
              this.selected &&
              !(this.list.length < 1) &&
              this.enableSelectAll
            ) {
              for (var e = !0, t = 0; t < this.list.length; t++) {
                var a = this.list[t];
                n.filterTask(a) &&
                  n.isTaskRetryable(a) &&
                  (this.selected[a.gid] || (e = !1));
              }
              for (t = 0; t < this.list.length; t++) {
                a = this.list[t];
                n.filterTask(a) &&
                  (n.isTaskRetryable(a)
                    ? (this.selected[a.gid] = !e)
                    : (this.selected[a.gid] = !1));
              }
            }
          },
          selectAllCompleted: function () {
            if (
              this.list &&
              this.selected &&
              !(this.list.length < 1) &&
              this.enableSelectAll
            ) {
              for (var e = !0, t = 0; t < this.list.length; t++) {
                var a = this.list[t];
                n.filterTask(a) &&
                  'complete' === a.status &&
                  (this.selected[a.gid] || (e = !1));
              }
              for (t = 0; t < this.list.length; t++) {
                a = this.list[t];
                n.filterTask(a) &&
                  ('complete' === a.status
                    ? (this.selected[a.gid] = !e)
                    : (this.selected[a.gid] = !1));
              }
            }
          },
        }),
        (n.filterTask = function (e) {
          return (
            !(!e || !angular.isString(e.taskName)) &&
            (!n.searchContext ||
              !n.searchContext.text ||
              0 <=
                e.taskName
                  .toLowerCase()
                  .indexOf(n.searchContext.text.toLowerCase()))
          );
        }),
        (n.isTaskRetryable = function (e) {
          return (
            e && 'error' === e.status && e.errorDescription && !e.bittorrent
          );
        }),
        (n.swipeActions = {
          leftSwipe: function () {
            l.getSwipeGesture() &&
              (angular.element('body').hasClass('sidebar-open')
                ? f()
                : (!this.extendLeftSwipe ||
                    (angular.isFunction(this.extendLeftSwipe) &&
                      !this.extendLeftSwipe())) &&
                  f());
          },
          rightSwipe: function () {
            l.getSwipeGesture() &&
              (!this.extendRightSwipe ||
                (angular.isFunction(this.extendRightSwipe) &&
                  !this.extendRightSwipe())) &&
              angular
                .element('body')
                .removeClass('sidebar-collapse')
                .addClass('sidebar-open');
          },
        }),
        (n.refreshPage = function () {
          a.location.reload();
        }),
        (n.setAutoRefreshAfterPageLoad = function () {
          c = !0;
        }),
        (n.setTheme = function (e) {
          'system' === e ? g() : 'dark' === e ? p() : u();
        }),
        l.onApplicationCacheUpdated(function () {
          i.notifyInPage(
            '',
            'Application cache has been updated, please reload the page for the changes to take effect.',
            {
              delay: !1,
              type: 'info',
              templateUrl: 'views/notification-reloadable.html',
            }
          );
        }),
        l.onFirstAccess(function () {
          i.notifyInPage('', 'Tap to configure and get started with AriaNg.', {
            delay: !1,
            onClose: function () {
              s.path('/settings/ariang');
            },
          });
        }),
        e.onFirstSuccess(function (e) {
          i.notifyInPage('', 'is connected', {
            type: 'success',
            contentPrefix: e.rpcName + ' ',
          });
        }),
        e.onConnectionSuccess(function () {
          'Connected' !== n.taskContext.rpcStatus &&
            (n.taskContext.rpcStatus = 'Connected');
        }),
        e.onConnectionFailed(function () {
          'Disconnected' !== n.taskContext.rpcStatus &&
            (n.taskContext.rpcStatus = 'Disconnected');
        }),
        e.onTaskCompleted(function (e) {
          i.notifyTaskComplete(e.task);
        }),
        e.onBtTaskCompleted(function (e) {
          i.notifyBtTaskComplete(e.task);
        }),
        e.onTaskErrorOccur(function (e) {
          i.notifyTaskError(e.task);
        }),
        n.$on('$locationChangeStart', function (e) {
          t.closeAllDialogs(),
            (n.loadPromise = null),
            delete n.swipeActions.extendLeftSwipe,
            delete n.swipeActions.extendRightSwipe,
            angular.isArray(n.taskContext.list) &&
              0 < n.taskContext.list.length &&
              (n.taskContext.list.length = 0),
            angular.isObject(n.taskContext.selected) &&
              (n.taskContext.selected = {}),
            (n.taskContext.enableSelectAll = !1);
        }),
        n.$on('$routeChangeStart', function (e, t, a) {
          var n,
            i = s.path();
          (n = i),
            angular.element('section.sidebar > ul li').removeClass('active'),
            angular
              .element('section.sidebar > ul > li[data-href-match]')
              .each(function (e, t) {
                var a = angular.element(t).attr('data-href-match');
                d(a, n) && angular.element(t).addClass('active');
              }),
            angular
              .element(
                'section.sidebar > ul > li.treeview > ul.treeview-menu > li[data-href-match]'
              )
              .each(function (e, t) {
                var a = angular.element(t).attr('data-href-match');
                d(a, n) &&
                  angular
                    .element(t)
                    .addClass('active')
                    .parent()
                    .parent()
                    .addClass('active');
              }),
            o.unbind('keypress');
        }),
        l.isBrowserSupportDarkMode()) &&
          a
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', function (e) {
              r.info(
                '[root] system switches to ' +
                  (e.matches ? 'dark' : 'light') +
                  ' theme'
              ),
                'system' === l.getTheme() && (e.matches ? p() : u());
            });
        n.$on('$locationChangeSuccess', function (e, t) {
          c && a.location.reload();
        }),
          'system' === l.getTheme() ? g() : 'dark' === l.getTheme() ? p() : u(),
          (function () {
            var e = l.getBrowserFeatures();
            if (
              (e.localStroage ||
                r.warn('[root.initCheck] LocalStorage is not supported!'),
              e.cookies || r.warn('[root.initCheck] Cookies is not supported!'),
              !l.isBrowserSupportStorage())
            )
              throw (
                (angular
                  .element('body')
                  .prepend('<div class="disable-overlay"></div>'),
                angular.element('.main-sidebar').addClass('blur'),
                angular.element('.navbar').addClass('blur'),
                angular.element('.content-body').addClass('blur'),
                i.notifyInPage(
                  '',
                  'You cannot use AriaNg because this browser does not meet the minimum requirements for data storage.',
                  { type: 'error', delay: !1 }
                ),
                new Error(
                  'You cannot use AriaNg because this browser does not meet the minimum requirements for data storage.'
                ))
              );
          })(),
          angular
            .element('section.sidebar > ul > li[data-href-match] > a')
            .click(function () {
              angular.element('section.sidebar > ul li').removeClass('active'),
                angular.element(this).parent().addClass('active');
            }),
          angular
            .element(
              'section.sidebar > ul > li.treeview > ul.treeview-menu > li[data-href-match] > a'
            )
            .click(function () {
              angular.element('section.sidebar > ul li').removeClass('active'),
                angular
                  .element(this)
                  .parent()
                  .addClass('active')
                  .parent()
                  .parent()
                  .addClass('active');
            });
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular
      .module('ariaNg')
      .constant('ariaNgConstants', {
        title: 'Aria',
        appPrefix: '',
        optionStorageKey: 'Options',
        languageStorageKeyPrefix: 'Language',
        settingHistoryKeyPrefix: 'History',
        languagePath: 'langs',
        languageFileExtension: '.txt',
        defaultLanguage: 'en',
        defaultHost: 'localhost',
        defaultSecureProtocol: 'https',
        defaultPathSeparator: '/',
        websocketAutoReconnect: !0,
        globalStatStorageCapacity: 120,
        taskStatStorageCapacity: 300,
        lazySaveTimeout: 500,
        errorTooltipDelay: 500,
        notificationInPageTimeout: 2e3,
        historyMaxStoreCount: 10,
        cachedDebugLogsLimit: 100,
      })
      .constant('ariaNgDefaultOptions', {
        language: 'en',
        theme: 'dark',
        title: '${downspeed}, ${upspeed} - ${title}',
        titleRefreshInterval: 5e3,
        browserNotification: !1,
        rpcAlias: 'aria2',
        rpcHost: 'REPLACE_SERVER_ADDR',
        rpcPort: '80',
        rpcInterface: 'jsonrpc',
        protocol: 'http',
        httpMethod: 'POST',
        secret: 'REPLACE_RPC_SECRET',
        extendRpcServers: [],
        globalStatRefreshInterval: 1e3,
        downloadTaskRefreshInterval: 1e3,
        swipeGesture: !0,
        dragAndDropTasks: !0,
        rpcListDisplayOrder: 'recentlyUsed',
        afterCreatingNewTask: 'task-list',
        removeOldTaskAfterRetrying: !1,
        confirmTaskRemoval: !0,
        includePrefixWhenCopyingFromTaskDetails: !0,
        showPiecesInfoInTaskDetailPage: 'le10240',
        afterRetryingTask: 'task-list-downloading',
        displayOrder: 'default:asc',
        fileListDisplayOrder: 'default:asc',
        peerListDisplayOrder: 'default:asc',
      });
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').constant('ariaNgBuildConfiguration', {
      buildVersion: 'v1.2.3',
      buildCommit: 'fb142ad',
    });
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').config([
      '$qProvider',
      '$translateProvider',
      'localStorageServiceProvider',
      'NotificationProvider',
      'ariaNgConstants',
      'ariaNgLanguages',
      function (e, t, a, n, i, s) {
        e.errorOnUnhandledRejections(!1),
          a
            .setPrefix(i.appPrefix)
            .setStorageType('localStorage')
            .setStorageCookie(365, '/');
        var o = [],
          r = {};
        for (var l in s)
          if (s.hasOwnProperty(l)) {
            var c = s[l].aliases;
            if ((o.push(l), angular.isArray(c) && !(c.length < 1)))
              for (var d = 0; d < c.length; d++) {
                r[c[d]] = l;
              }
          }
        t
          .useLoader('ariaNgLanguageLoader')
          .useLoaderCache(!0)
          .registerAvailableLanguageKeys(o, r)
          .fallbackLanguage(i.defaultLanguage)
          .useSanitizeValueStrategy('escapeParameters'),
          n.setOptions({ delay: i.notificationInPageTimeout });
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').constant('ariaNgFileTypes', {
      video: {
        name: 'Videos',
        extensions: [
          '.3g2',
          '.3gp',
          '.3gp2',
          '.3gpp',
          '.asf',
          '.asx',
          '.avi',
          '.dat',
          '.divx',
          '.flv',
          '.m1v',
          '.m2ts',
          '.m2v',
          '.m4v',
          '.mkv',
          '.mov',
          '.mp4',
          '.mpe',
          '.mpeg',
          '.mpg',
          '.mts',
          '.ogv',
          '.qt',
          '.ram',
          '.rm',
          '.rmvb',
          '.ts',
          '.vob',
          '.wmv',
        ],
      },
      audio: {
        name: 'Audios',
        extensions: [
          '.aac',
          '.ac3',
          '.adts',
          '.amr',
          '.ape',
          '.eac3',
          '.flac',
          '.m1a',
          '.m2a',
          '.m4a',
          '.mid',
          '.mka',
          '.mp2',
          '.mp3',
          '.mpa',
          '.mpc',
          '.ogg',
          '.ra',
          '.tak',
          '.vqf',
          '.wm',
          '.wav',
          '.wma',
          '.wv',
        ],
      },
      picture: {
        name: 'Pictures',
        extensions: [
          '.abr',
          '.bmp',
          '.emf',
          '.gif',
          '.j2c',
          '.j2k',
          '.jfif',
          '.jif',
          '.jp2',
          '.jpc',
          '.jpe',
          '.jpeg',
          '.jpf',
          '.jpg',
          '.jpk',
          '.jpx',
          '.pcx',
          '.pct',
          '.pic',
          '.pict',
          '.png',
          '.pns',
          '.psd',
          '.psdx',
          '.raw',
          '.svg',
          '.svgz',
          '.tga',
          '.tif',
          '.tiff',
          '.wbm',
          '.wbmp',
          '.webp',
          '.wmf',
          '.xif',
        ],
      },
      document: {
        name: 'Documents',
        extensions: [
          '.csv',
          '.doc',
          '.docm',
          '.docx',
          '.dot',
          '.dotm',
          '.dotx',
          '.key',
          '.mpp',
          '.numbers',
          '.odp',
          '.ods',
          '.odt',
          '.pages',
          '.pdf',
          '.pot',
          '.potm',
          '.potx',
          '.pps',
          '.ppsm',
          '.ppsx',
          '.ppt',
          '.pptm',
          '.pptx',
          '.rtf',
          '.txt',
          '.vsd',
          '.vsdx',
          '.wk1',
          '.wk2',
          '.wk3',
          '.wk4',
          '.wks',
          '.wpd',
          '.wps',
          '.xla',
          '.xlam',
          '.xll',
          '.xlm',
          '.xls',
          '.xlsb',
          '.xlsm',
          '.xlsx',
          '.xlt',
          '.xltx',
          '.xlw',
          '.xps',
        ],
      },
      application: {
        name: 'Applications',
        extensions: [
          '.apk',
          '.bat',
          '.com',
          '.deb',
          '.dll',
          '.dmg',
          '.exe',
          '.ipa',
          '.jar',
          '.msi',
          '.rpm',
          '.sh',
        ],
      },
      archive: {
        name: 'Archives',
        extensions: [
          '.001',
          '.7z',
          '.ace',
          '.arj',
          '.bz2',
          '.cab',
          '.cbr',
          '.cbz',
          '.gz',
          '.img',
          '.iso',
          '.lzh',
          '.qcow2',
          '.r',
          '.rar',
          '.sef',
          '.tar',
          '.taz',
          '.tbz',
          '.tbz2',
          '.uue',
          '.vdi',
          '.vhd',
          '.vmdk',
          '.wim',
          '.xar',
          '.xz',
          '.z',
          '.zip',
        ],
      },
    });
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').run([
      'moment',
      'ariaNgLocalizationService',
      'ariaNgSettingService',
      function (e, t, a) {
        var n = a.getLanguage();
        e.updateLocale('zh-cn', { week: null }), t.applyLanguage(n);
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').constant('ariaNgLanguages', {
      en: { name: 'English', displayName: 'English' },
      zh_Hans: {
        name: 'Simplified Chinese',
        displayName: '简体中文',
        aliases: ['zh_CHS', 'zh_CN', 'zh_SG'],
      },
      zh_Hant: {
        name: 'Traditional Chinese',
        displayName: '繁體中文',
        aliases: ['zh_CHT', 'zh_TW', 'zh_HK', 'zh_MO'],
      },
    });
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').config([
      '$translateProvider',
      'ariaNgConstants',
      function (e, t) {
        e.translations(t.defaultLanguage, {
          'AriaNg Version': 'AriaNg Version',
          'Operation Result': 'Operation Result',
          'Operation Succeeded': 'Operation Succeeded',
          'is connected': 'is connected',
          Error: 'Error',
          OK: 'OK',
          Confirm: 'Confirm',
          Cancel: 'Cancel',
          Close: 'Close',
          True: 'True',
          False: 'False',
          Connecting: 'Connecting',
          Connected: 'Connected',
          Disconnected: 'Disconnected',
          Global: 'Global',
          New: 'New',
          Start: 'Start',
          Pause: 'Pause',
          Retry: 'Retry',
          'Retry Selected Tasks': 'Retry Selected Tasks',
          Delete: 'Delete',
          'Select All': 'Select All',
          'Select None': 'Select None',
          'Select Invert': 'Select Invert',
          'Select All Failed Tasks': 'Select All Failed Tasks',
          'Select All Completed Tasks': 'Select All Completed Tasks',
          'Display Order': 'Display Order',
          'Copy Download Url': 'Copy Download Url',
          'Copy Magnet Link': 'Copy Magnet Link',
          Help: 'Help',
          Search: 'Search',
          Default: 'Default',
          Expand: 'Expand',
          Collapse: 'Collapse',
          'Expand All': 'Expand All',
          'Collapse All': 'Collapse All',
          Open: 'Open',
          Save: 'Save',
          Import: 'Import',
          'Remove Task': 'Remove Task',
          'Clear Stopped Tasks': 'Clear Stopped Tasks',
          'Click to view task detail': 'Click to view task detail',
          'By File Name': 'By File Name',
          'By File Size': 'By File Size',
          'By Progress': 'By Progress',
          'By Selected Status': 'By Selected Status',
          'By Remaining': 'By Remaining',
          'By Download Speed': 'By Download Speed',
          'By Upload Speed': 'By Upload Speed',
          'By Peer Address': 'By Peer Address',
          'By Client Name': 'By Client Name',
          Filters: 'Filters',
          Download: 'Download',
          Upload: 'Upload',
          Downloading: 'Downloading',
          'Pending Verification': 'Pending Verification',
          Verifying: 'Verifying',
          Seeding: 'Seeding',
          Waiting: 'Waiting',
          Paused: 'Paused',
          Completed: 'Completed',
          'Error Occurred': 'Error Occurred',
          Removed: 'Removed',
          'Finished / Stopped': 'Finished / Stopped',
          Uncompleted: 'Uncompleted',
          'Click to pin': 'Click to pin',
          Settings: 'Settings',
          'AriaNg Settings': 'AriaNg Settings',
          'Aria2 Settings': 'Aria2 Settings',
          'Basic Settings': 'Basic Settings',
          'HTTP/FTP/SFTP Settings': 'HTTP/FTP/SFTP Settings',
          'HTTP Settings': 'HTTP Settings',
          'FTP/SFTP Settings': 'FTP/SFTP Settings',
          'BitTorrent Settings': 'BitTorrent Settings',
          'Metalink Settings': 'Metalink Settings',
          'RPC Settings': 'RPC Settings',
          'Advanced Settings': 'Advanced Settings',
          'AriaNg Debug Console': 'AriaNg Debug Console',
          'Aria2 Status': 'Aria2 Status',
          'File Name': 'File Name',
          'File Size': 'File Size',
          Progress: 'Progress',
          'Share Ratio': 'Share Ratio',
          Remaining: 'Remaining',
          'Download Speed': 'Download Speed',
          'Upload Speed': 'Upload Speed',
          Links: 'Links',
          'Torrent File': 'Torrent File',
          'Metalink File': 'Metalink File',
          'File Name:': 'File Name:',
          Options: 'Options',
          Overview: 'Overview',
          Pieces: 'Pieces',
          Files: 'Files',
          Peers: 'Peers',
          'Task Name': 'Task Name',
          'Task Size': 'Task Size',
          'Task Status': 'Task Status',
          'Error Description': 'Error Description',
          'Health Percentage': 'Health Percentage',
          'Info Hash': 'Info Hash',
          Seeders: 'Seeders',
          Connections: 'Connections',
          'Seed Creation Time': 'Seed Creation Time',
          'Download Url': 'Download Url',
          'Download Dir': 'Download Dir',
          'BT Tracker Servers': 'BT Tracker Servers',
          Copy: 'Copy',
          '(Choose Files)': '(Choose Files)',
          Videos: 'Videos',
          Audios: 'Audios',
          Pictures: 'Pictures',
          Documents: 'Documents',
          Applications: 'Applications',
          Archives: 'Archives',
          Other: 'Other',
          Custom: 'Custom',
          'Custom Choose File': 'Custom Choose File',
          Address: 'Address',
          Client: 'Client',
          Status: 'Status',
          Speed: 'Speed',
          '(local)': '(local)',
          'No Data': 'No Data',
          'No connected peers': 'No connected peers',
          'Failed to change some tasks state.':
            'Failed to change some tasks state.',
          'Confirm Retry': 'Confirm Retry',
          'Are you sure you want to retry the selected task? AriaNg will create same task after clicking OK.':
            'Are you sure you want to retry the selected task? AriaNg will create same task after clicking OK.',
          'Failed to retry this task.': 'Failed to retry this task.',
          '{successCount} tasks have been retried and {failedCount} tasks are failed.':
            '{{successCount}} tasks have been retried and {{failedCount}} tasks are failed.',
          'Confirm Remove': 'Confirm Remove',
          'Are you sure you want to remove the selected task?':
            'Are you sure you want to remove the selected task?',
          'Failed to remove some task(s).': 'Failed to remove some task(s).',
          'Confirm Clear': 'Confirm Clear',
          'Are you sure you want to clear stopped tasks?':
            'Are you sure you want to clear stopped tasks?',
          'Download Links:': 'Download Links:',
          'Open Torrent File': 'Open Torrent File',
          'Open Metalink File': 'Open Metalink File',
          'Download Now': 'Download Now',
          'Download Later': 'Download Later',
          'Support multiple URLs, one URL per line.':
            'Support multiple URLs, one URL per line.',
          'Your browser does not support loading file!':
            'Your browser does not support loading file!',
          'The selected file type is invalid!':
            'The selected file type is invalid!',
          'Failed to load file!': 'Failed to load file!',
          'Download Completed': 'Download Completed',
          'BT Download Completed': 'BT Download Completed',
          'Download Error': 'Download Error',
          Language: 'Language',
          Theme: 'Theme',
          Light: 'Light',
          Dark: 'Dark',
          'Follow system settings': 'Follow system settings',
          'Debug Mode': 'Debug Mode',
          'Page Title': 'Page Title',
          Preview: 'Preview',
          'Tips: You can use the "noprefix" tag to ignore the prefix, "nosuffix" tag to ignore the suffix, and "scale=n" tag to set the decimal precision.':
            'Tips: You can use the "noprefix" tag to ignore the prefix, "nosuffix" tag to ignore the suffix, and "scale=n" tag to set the decimal precision.',
          'Example: ${downspeed:noprefix:nosuffix:scale=1}':
            'Example: ${downspeed:noprefix:nosuffix:scale=1}',
          'Updating Page Title Interval': 'Updating Page Title Interval',
          'Enable Browser Notification': 'Enable Browser Notification',
          'Aria2 RPC Alias': 'Aria2 RPC Alias',
          'Aria2 RPC Address': 'Aria2 RPC Address',
          'Aria2 RPC Protocol': 'Aria2 RPC Protocol',
          'Aria2 RPC Http Request Method': 'Aria2 RPC Http Request Method',
          'POST method only supports aria2 v1.15.2 and above.':
            'POST method only supports aria2 v1.15.2 and above.',
          'Aria2 RPC Secret Token': 'Aria2 RPC Secret Token',
          Activate: 'Activate',
          'Reset Settings': 'Reset Settings',
          'Confirm Reset': 'Confirm Reset',
          'Are you sure you want to reset all settings?':
            'Are you sure you want to reset all settings?',
          'Clear Settings History': 'Clear Settings History',
          'Are you sure you want to clear all settings history?':
            'Are you sure you want to clear all settings history?',
          'Delete RPC Setting': 'Delete RPC Setting',
          'Add New RPC Setting': 'Add New RPC Setting',
          'Are you sure you want to remove rpc setting "{rpcName}"?':
            'Are you sure you want to remove rpc setting "{{rpcName}}"?',
          'Updating Global Stat Interval': 'Updating Global Stat Interval',
          'Updating Task Information Interval':
            'Updating Task Information Interval',
          'Swipe Gesture': 'Swipe Gesture',
          'Change Tasks Order by Drag-and-drop':
            'Change Tasks Order by Drag-and-drop',
          'Action After Creating New Tasks': 'Action After Creating New Tasks',
          'Navigate to Task List Page': 'Navigate to Task List Page',
          'Navigate to Task Detail Page': 'Navigate to Task Detail Page',
          'Action After Retrying Task': 'Action After Retrying Task',
          'Navigate to Downloading Tasks Page':
            'Navigate to Downloading Tasks Page',
          'Stay on Current Page': 'Stay on Current Page',
          'Remove Old Tasks After Retrying': 'Remove Old Tasks After Retrying',
          'Confirm Task Removal': 'Confirm Task Removal',
          'Include Prefix When Copying From Task Details':
            'Include Prefix When Copying From Task Details',
          'Show Pieces Info In Task Detail Page':
            'Show Pieces Info In Task Detail Page',
          'Pieces Amount is Less than or Equal to {value}':
            'Pieces Amount is Less than or Equal to {{value}}',
          'RPC List Display Order': 'RPC List Display Order',
          'Recently Used': 'Recently Used',
          'RPC Alias': 'RPC Alias',
          'Import / Export AriaNg Settings': 'Import / Export AriaNg Settings',
          'Import Settings': 'Import Settings',
          'Export Settings': 'Export Settings',
          'AriaNg settings data': 'AriaNg settings data',
          'Confirm Import': 'Confirm Import',
          'Are you sure you want to import all settings?':
            'Are you sure you want to import all settings?',
          'Invalid settings data format!': 'Invalid settings data format!',
          'Data has been copied to clipboard.':
            'Data has been copied to clipboard.',
          'Supported Placeholder': 'Supported Placeholder',
          'AriaNg Title': 'AriaNg Title',
          'Current RPC Alias': 'Current RPC Alias',
          'Downloading Count': 'Downloading Count',
          'Waiting Count': 'Waiting Count',
          'Stopped Count': 'Stopped Count',
          "You have disabled notification in your browser. You should change your browser's settings before you enable this function.":
            "You have disabled notification in your browser. You should change your browser's settings before you enable this function.",
          'Application cache has been updated, please reload the page for the changes to take effect.':
            'Application cache has been updated, please reload the page for the changes to take effect.',
          'Language resource has been updated, please reload the page for the changes to take effect.':
            'Language resource has been updated, please reload the page for the changes to take effect.',
          'Configuration has been modified, please reload the page for the changes to take effect.':
            'Configuration has been modified, please reload the page for the changes to take effect.',
          'Reload AriaNg': 'Reload AriaNg',
          'Show Secret': 'Show Secret',
          'Hide Secret': 'Hide Secret',
          'Aria2 Version': 'Aria2 Version',
          'Enabled Features': 'Enabled Features',
          Operations: 'Operations',
          'Save Session': 'Save Session',
          'Shutdown Aria2': 'Shutdown Aria2',
          'Confirm Shutdown': 'Confirm Shutdown',
          'Are you sure you want to shutdown aria2?':
            'Are you sure you want to shutdown aria2?',
          'Session has been saved successfully.':
            'Session has been saved successfully.',
          'Aria2 has been shutdown successfully.':
            'Aria2 has been shutdown successfully.',
          'Toggle Navigation': 'Toggle Navigation',
          Shortcut: 'Shortcut',
          'Global Rate Limit': 'Global Rate Limit',
          Loading: 'Loading...',
          'More Than One Day': 'More than 1 day',
          Unknown: 'Unknown',
          Bytes: 'Bytes',
          Hours: 'Hours',
          Minutes: 'Minutes',
          Seconds: 'Seconds',
          Milliseconds: 'Milliseconds',
          Http: 'Http',
          'Http (Disabled)': 'Http (Disabled)',
          Https: 'Https',
          WebSocket: 'WebSocket',
          'WebSocket (Disabled)': 'WebSocket (Disabled)',
          'WebSocket (Security)': 'WebSocket (Security)',
          'Http and WebSocket would be disabled when accessing AriaNg via Https.':
            'Http and WebSocket would be disabled when accessing AriaNg via Https.',
          POST: 'POST',
          GET: 'GET',
          Enabled: 'Enabled',
          Disabled: 'Disabled',
          Always: 'Always',
          Never: 'Never',
          BitTorrent: 'BitTorrent',
          'Changes to the settings take effect after refreshing page.':
            'Changes to the settings take effect after refreshing page.',
          'Latest {{count}} Logs': 'Latest {{count}} Logs',
          'Show Detail': 'Show Detail',
          'Log Detail': 'Log Detail',
          'Type is illegal!': 'Type is illegal!',
          'Parameter is invalid!': 'Parameter is invalid!',
          'Option value cannot be empty!': 'Option value cannot be empty!',
          'Input number is invalid!': 'Input number is invalid!',
          'Input number is below min value!':
            'Input number is below min value {{value}}!',
          'Input number is above max value!':
            'Input number is above max value {{value}}!',
          'Input value is invalid!': 'Input value is invalid!',
          'Protocol is invalid!': 'Protocol is invalid!',
          'RPC host cannot be empty!': 'RPC host cannot be empty!',
          'RPC secret is not base64 encoded!':
            'RPC secret is not base64 encoded!',
          'URL is not base64 encoded!': 'URL is not base64 encoded!',
          'Tap to configure and get started with AriaNg.':
            'Tap to configure and get started with AriaNg.',
          'Cannot initialize WebSocket!': 'Cannot initialize WebSocket!',
          'Access Denied!': 'Access Denied!',
          'You cannot use AriaNg because this browser does not meet the minimum requirements for data storage.':
            'You cannot use AriaNg because this browser does not meet the minimum requirements for data storage.',
          error: {
            unknown: 'Unknown error occurred.',
            'operation.timeout': 'Operation timed out.',
            'resource.notfound': 'Resource was not found.',
            'error.resource.notfound.max-file-not-found':
              'Resource was not found. See --max-file-not-found option.',
            'error.download.aborted.lowest-speed-limit':
              'Download is aborted because download speed was too slow. See --lowest-speed-limit option.',
            'network.problem': 'Network problem occurred.',
            'resume.notsupported': 'Remote server does not support resume.',
            'space.notenough': 'There was not enough disk space available.',
            'piece.length.different':
              'Piece length was different from one in .aria2 control file. See --allow-piece-length-change option.',
            'download.sametime':
              'aria2 was downloading same file at that moment.',
            'download.torrent.sametime':
              'aria2 was downloading same file at that moment.',
            'file.exists':
              'File already existed. See --allow-overwrite option.',
            'file.rename.failed':
              'Failed to rename file. See --auto-file-renaming option.',
            'file.open.failed': 'Failed to open existing file.',
            'file.create.failed':
              'Failed to create new file or truncate existing file.',
            'io.error': 'Filesystem error occurred.',
            'directory.create.failed': 'Failed to create directory.',
            'name.resolution.failed': 'Failed to resolve domain name.',
            'metalink.file.parse.failed': 'Failed to parse Metalink document.',
            'ftp.command.failed': 'FTP command failed.',
            'http.response.header.bad':
              'HTTP response header was bad or unexpected.',
            'redirects.toomany': 'Too many redirects occurred.',
            'http.authorization.failed': 'HTTP authorization failed.',
            'bencoded.file.parse.failed':
              'Failed to parse bencoded file (usually ".torrent" file).',
            'torrent.file.corrupted':
              'The ".torrent" file was corrupted or missing information that aria2 needed.',
            'magnet.uri.bad': 'Magnet URI was bad.',
            'option.bad':
              'Bad/unrecognized option was given or unexpected option argument was given.',
            'server.overload':
              'The remote server was unable to handle the request due to a temporary overloading or maintenance.',
            'rpc.request.parse.failed': 'Failed to parse JSON-RPC request.',
            'checksum.failed': 'Checksum validation failed.',
          },
          languages: {
            English: 'English',
            'Simplified Chinese': 'Simplified Chinese',
            'Traditional Chinese': 'Traditional Chinese',
          },
          format: {
            longdate: 'MM/DD/YYYY HH:mm:ss',
            'time.millisecond': '{{value}} Millisecond',
            'time.milliseconds': '{{value}} Milliseconds',
            'time.second': '{{value}} Second',
            'time.seconds': '{{value}} Seconds',
            'time.minute': '{{value}} Minute',
            'time.minutes': '{{value}} Minutes',
            'time.hour': '{{value}} Hour',
            'time.hours': '{{value}} Hours',
            'requires.aria2-version': 'Requires aria2 v{{version}} or higher',
            'task.new.download-links': 'Download Links ({{count}} Links):',
            'task.pieceinfo': 'Completed: {{completed}}, Total: {{total}}',
            'task.error-occurred': 'Error Occurred ({{errorcode}})',
            'task.verifying-percent': 'Verifying ({{verifiedPercent}}%)',
            'settings.file-count': '({{count}} Files)',
            'settings.total-count': '(Total Count: {{count}})',
            'debug.latest-logs': 'Latest {{count}} Logs',
          },
          rpc: { error: { unauthorized: 'Authorization Failed!' } },
          option: {
            true: 'True',
            false: 'False',
            default: 'Default',
            none: 'None',
            hide: 'Hide',
            full: 'Full',
            http: 'Http',
            https: 'Https',
            ftp: 'Ftp',
            mem: 'Memory Only',
            get: 'GET',
            tunnel: 'TUNNEL',
            plain: 'Plain',
            arc4: 'ARC4',
            binary: 'Binary',
            ascii: 'ASCII',
            debug: 'Debug',
            info: 'Info',
            notice: 'Notice',
            warn: 'Warn',
            error: 'Error',
            adaptive: 'adaptive',
            epoll: 'epoll',
            falloc: 'falloc',
            feedback: 'feedback',
            geom: 'geom',
            inorder: 'inorder',
            kqueue: 'kqueue',
            poll: 'poll',
            port: 'port',
            prealloc: 'prealloc',
            random: 'random',
            select: 'select',
            trunc: 'trunc',
            SSLv3: 'SSLv3',
            TLSv1: 'TLSv1',
            'TLSv1.1': 'TLSv1.1',
            'TLSv1.2': 'TLSv1.2',
          },
          options: {
            'dir.name': 'Download Path',
            'dir.description': '',
            'log.name': 'Log File',
            'log.description':
              'The file name of the log file. If - is specified, log is written to stdout. If empty string("") is specified, or this option is omitted, no log is written to disk at all.',
            'max-concurrent-downloads.name': 'Max Concurrent Downloads',
            'max-concurrent-downloads.description': '',
            'check-integrity.name': 'Check Integrity',
            'check-integrity.description':
              'Check file integrity by validating piece hashes or a hash of entire file. This option has effect only in BitTorrent, Metalink downloads with checksums or HTTP(S)/FTP downloads with --checksum option.',
            'continue.name': 'Resume Download',
            'continue.description':
              'Continue downloading a partially downloaded file. Use this option to resume a download started by a web browser or another program which downloads files sequentially from the beginning. Currently this option is only applicable to HTTP(S)/FTP downloads.',
            'all-proxy.name': 'Proxy Server',
            'all-proxy.description':
              'Use a proxy server for all protocols. To override a previously defined proxy, use "". You also can override this setting and specify a proxy server for a particular protocol using --http-proxy, --https-proxy and --ftp-proxy  This affects all downloads. The format of PROXY is [http://][USER:PASSWORD@]HOST[:PORT].',
            'all-proxy-user.name': 'Proxy User Name',
            'all-proxy-user.description': '',
            'all-proxy-passwd.name': 'Proxy Password',
            'all-proxy-passwd.description': '',
            'connect-timeout.name': 'Connect Timeout',
            'connect-timeout.description':
              'Set the connect timeout in seconds to establish connection to HTTP/FTP/proxy server. After the connection is established, this option makes no effect and --timeout option is used instead.',
            'dry-run.name': 'Dry Run',
            'dry-run.description':
              "If true is given, aria2 just checks whether the remote file is available and doesn't download data. This option has effect on HTTP/FTP download. BitTorrent downloads are canceled if true is specified.",
            'lowest-speed-limit.name': 'Lowest Speed Limit',
            'lowest-speed-limit.description':
              'Close connection if download speed is lower than or equal to this value(bytes per sec). 0 means aria2 does not have a lowest speed limit. You can append K or M (1K = 1024, 1M = 1024K). This option does not affect BitTorrent downloads.',
            'max-connection-per-server.name': 'Max Connection Per Server',
            'max-connection-per-server.description': '',
            'max-file-not-found.name': 'Max File Not Found Try Times',
            'max-file-not-found.description':
              'If aria2 receives "file not found" status from the remote HTTP/FTP servers NUM times without getting a single byte, then force the download to fail. Specify 0 to disable this option. This options is effective only when using HTTP/FTP servers. The number of retry attempt is counted toward --max-tries, so it should be configured too.',
            'max-tries.name': 'Max Try Times',
            'max-tries.description': 'Set number of tries. 0 means unlimited.',
            'min-split-size.name': 'Min Split Size',
            'min-split-size.description':
              "aria2 does not split less than 2*SIZE byte range. For example, let's consider downloading 20MiB file. If SIZE is 10M, aria2 can split file into 2 range [0-10MiB) and [10MiB-20MiB) and download it using 2 sources(if --split >= 2, of course). If SIZE is 15M, since 2*15M > 20MiB, aria2 does not split file and download it using 1 source. You can append K or M (1K = 1024, 1M = 1024K). Possible Values: 1M-1024M.",
            'netrc-path.name': '.netrc Path',
            'netrc-path.description': '',
            'no-netrc.name': 'Disable netrc',
            'no-netrc.description': '',
            'no-proxy.name': 'No Proxy List',
            'no-proxy.description':
              'Specify a comma separated list of host names, domains and network addresses with or without a subnet mask where no proxy should be used.',
            'out.name': 'File Name',
            'out.description':
              'The file name of the downloaded file. It is always relative to the directory given in --dir option. When the --force-sequential option is used, this option is ignored.',
            'proxy-method.name': 'Proxy Method',
            'proxy-method.description':
              'Set the method to use in proxy request. METHOD is either GET or TUNNEL. HTTPS downloads always use TUNNEL regardless of this option.',
            'remote-time.name': 'Remote File Timestamp',
            'remote-time.description':
              'Retrieve timestamp of the remote file from the remote HTTP/FTP server and if it is available, apply it to the local file.',
            'reuse-uri.name': 'Reuse Uri',
            'reuse-uri.description':
              'Reuse already used URIs if no unused URIs are left.',
            'retry-wait.name': 'Retry Wait',
            'retry-wait.description':
              'Set the seconds to wait between retries. When SEC > 0, aria2 will retry downloads when the HTTP server returns a 503 response.',
            'server-stat-of.name': 'Server Stat Output',
            'server-stat-of.description':
              'Specify the file name to which performance profile of the servers is saved. You can load saved data using --server-stat-if option.',
            'server-stat-timeout.name': 'Server Stat Timeout',
            'server-stat-timeout.description':
              'Specifies timeout in seconds to invalidate performance profile of the servers since the last contact to them.',
            'split.name': 'Split Count',
            'split.description':
              'Download a file using N connections. If more than N URIs are given, first N URIs are used and remaining URIs are used for backup. If less than N URIs are given, those URIs are used more than once so that N connections total are made simultaneously. The number of connections to the same host is restricted by the --max-connection-per-server option.',
            'stream-piece-selector.name': 'Piece Selection Algorithm',
            'stream-piece-selector.description':
              'Specify piece selection algorithm used in HTTP/FTP download. Piece means fixed length segment which is downloaded in parallel in segmented download. If default is given, aria2 selects piece so that it reduces the number of establishing connection. This is reasonable default behavior because establishing connection is an expensive operation. If inorder is given, aria2 selects piece which has minimum index. Index=0 means first of the file. This will be useful to view movie while downloading it. --enable-http-pipelining option may be useful to reduce re-connection overhead. Please note that aria2 honors --min-split-size option, so it will be necessary to specify a reasonable value to --min-split-size option. If random is given, aria2 selects piece randomly. Like inorder, --min-split-size option is honored. If geom is given, at the beginning aria2 selects piece which has minimum index like inorder, but it exponentially increasingly keeps space from previously selected piece. This will reduce the number of establishing connection and at the same time it will download the beginning part of the file first. This will be useful to view movie while downloading it.',
            'timeout.name': 'Timeout',
            'timeout.description': '',
            'uri-selector.name': 'URI Selection Algorithm',
            'uri-selector.description':
              "Specify URI selection algorithm. The possible values are inorder, feedback and adaptive. If inorder is given, URI is tried in the order appeared in the URI list. If feedback is given, aria2 uses download speed observed in the previous downloads and choose fastest server in the URI list. This also effectively skips dead mirrors. The observed download speed is a part of performance profile of servers mentioned in --server-stat-of and --server-stat-if  If adaptive is given, selects one of the best mirrors for the first and reserved connections. For supplementary ones, it returns mirrors which has not been tested yet, and if each of them has already been tested, returns mirrors which has to be tested again. Otherwise, it doesn't select anymore mirrors. Like feedback, it uses a performance profile of servers.",
            'check-certificate.name': 'Check Certificate',
            'check-certificate.description': '',
            'http-accept-gzip.name': 'Accept GZip',
            'http-accept-gzip.description':
              'Send Accept: deflate, gzip request header and inflate response if remote server responds with Content-Encoding: gzip or Content-Encoding: deflate.',
            'http-auth-challenge.name': 'Auth Challenge',
            'http-auth-challenge.description':
              'Send HTTP authorization header only when it is requested by the server. If false is set, then authorization header is always sent to the server. There is an exception: if user name and password are embedded in URI, authorization header is always sent to the server regardless of this option.',
            'http-no-cache.name': 'No Cache',
            'http-no-cache.description':
              'Send Cache-Control: no-cache and Pragma: no-cache header to avoid cached content. If false is given, these headers are not sent and you can add Cache-Control header with a directive you like using --header option.',
            'http-user.name': 'HTTP Default User Name',
            'http-user.description': '',
            'http-passwd.name': 'HTTP Default Password',
            'http-passwd.description': '',
            'http-proxy.name': 'HTTP Proxy Server',
            'http-proxy.description': '',
            'http-proxy-user.name': 'HTTP Proxy User Name',
            'http-proxy-user.description': '',
            'http-proxy-passwd.name': 'HTTP Proxy Password',
            'http-proxy-passwd.description': '',
            'https-proxy.name': 'HTTPS Proxy Server',
            'https-proxy.description': '',
            'https-proxy-user.name': 'HTTPS Proxy User Name',
            'https-proxy-user.description': '',
            'https-proxy-passwd.name': 'HTTPS Proxy Password',
            'https-proxy-passwd.description': '',
            'referer.name': 'Referer',
            'referer.description':
              'Set an http referrer (Referer). This affects all http/https downloads. If * is given, the download URI is also used as the referrer. This may be useful when used together with the --parameterized-uri option.',
            'enable-http-keep-alive.name': 'Enable Persistent Connection',
            'enable-http-keep-alive.description':
              'Enable HTTP/1.1 persistent connection.',
            'enable-http-pipelining.name': 'Enable HTTP Pipelining',
            'enable-http-pipelining.description': 'Enable HTTP/1.1 pipelining.',
            'header.name': 'Custom Header',
            'header.description':
              'Append HEADER to HTTP request header. Put one item per line, each item containing "header name: header value".',
            'save-cookies.name': 'Cookies Path',
            'save-cookies.description':
              'Save Cookies to FILE in Mozilla/Firefox(1.x/2.x)/ Netscape format. If FILE already exists, it is overwritten. Session Cookies are also saved and their expiry values are treated as 0.',
            'use-head.name': 'Use HEAD Method',
            'use-head.description':
              'Use HEAD method for the first request to the HTTP server.',
            'user-agent.name': 'Custom User Agent',
            'user-agent.description': '',
            'ftp-user.name': 'FTP Default User Name',
            'ftp-user.description': '',
            'ftp-passwd.name': 'FTP Default Password',
            'ftp-passwd.description':
              'If user name is embedded but password is missing in URI, aria2 tries to resolve password using .netrc. If password is found in .netrc, then use it as password. If not, use the password specified in this option.',
            'ftp-pasv.name': 'Passive Mode',
            'ftp-pasv.description':
              'Use the passive mode in FTP. If false is given, the active mode will be used. This option is ignored for SFTP transfer.',
            'ftp-proxy.name': 'FTP Proxy Server',
            'ftp-proxy.description': '',
            'ftp-proxy-user.name': 'FTP Proxy User Name',
            'ftp-proxy-user.description': '',
            'ftp-proxy-passwd.name': 'FTP Proxy Password',
            'ftp-proxy-passwd.description': '',
            'ftp-type.name': 'Transfer Type',
            'ftp-type.description': '',
            'ftp-reuse-connection.name': 'Reuse Connection',
            'ftp-reuse-connection.description': '',
            'ssh-host-key-md.name': 'SSH Public Key Checksum',
            'ssh-host-key-md.description':
              "Set checksum for SSH host public key. TYPE is hash type. The supported hash type is sha-1 or md5. DIGEST is hex digest. For example: sha-1=b030503d4de4539dc7885e6f0f5e256704edf4c3. This option can be used to validate server's public key when SFTP is used. If this option is not set, which is default, no validation takes place.",
            'bt-detach-seed-only.name': 'Detach Seed Only',
            'bt-detach-seed-only.description':
              'Exclude seed only downloads when counting concurrent active downloads (See -j option). This means that if -j3 is given and this option is turned on and 3 downloads are active and one of those enters seed mode, then it is excluded from active download count (thus it becomes 2), and the next download waiting in queue gets started. But be aware that seeding item is still recognized as active download in RPC method.',
            'bt-enable-hook-after-hash-check.name':
              'Enable Hook After Hash Check',
            'bt-enable-hook-after-hash-check.description':
              'Allow hook command invocation after hash check (see -V option) in BitTorrent download. By default, when hash check succeeds, the command given by --on-bt-download-complete is executed. To disable this action, give false to this option.',
            'bt-enable-lpd.name': 'Enable Local Peer Discovery (LPD)',
            'bt-enable-lpd.description':
              "Enable Local Peer Discovery. If a private flag is set in a torrent, aria2 doesn't use this feature for that download even if true is given.",
            'bt-exclude-tracker.name': 'BitTorrent Exclude Trackers',
            'bt-exclude-tracker.description':
              "Comma separated list of BitTorrent tracker's announce URI to remove. You can use special value * which matches all URIs, thus removes all announce URIs. When specifying * in shell command-line, don't forget to escape or quote it.",
            'bt-external-ip.name': 'External IP',
            'bt-external-ip.description':
              'Specify the external IP address to use in BitTorrent download and DHT. It may be sent to BitTorrent tracker. For DHT, this option should be set to report that local node is downloading a particular torrent. This is critical to use DHT in a private network. Although this function is named external, it can accept any kind of IP addresses.',
            'bt-force-encryption.name': 'Force Encryption',
            'bt-force-encryption.description':
              'Requires BitTorrent message payload encryption with arc4. This is a shorthand of --bt-require-crypto --bt-min-crypto-level=arc4. This option does not change the option value of those options. If true is given, deny legacy BitTorrent handshake and only use Obfuscation handshake and always encrypt message payload.',
            'bt-hash-check-seed.name': 'Hash Check Before Seeding',
            'bt-hash-check-seed.description':
              'If true is given, after hash check using --check-integrity option and file is complete, continue to seed file. If you want to check file and download it only when it is damaged or incomplete, set this option to false. This option has effect only on BitTorrent download.',
            'bt-load-saved-metadata.name': 'Load Saved Metadata File',
            'bt-load-saved-metadata.description':
              'Before getting torrent metadata from DHT when downloading with magnet link, first try to read file saved by --bt-save-metadata option. If it is successful, then skip downloading metadata from DHT.',
            'bt-max-open-files.name': 'Max Open Files',
            'bt-max-open-files.description':
              'Specify maximum number of files to open in multi-file BitTorrent/Metalink download globally.',
            'bt-max-peers.name': 'Max Peers',
            'bt-max-peers.description':
              'Specify the maximum number of peers per torrent. 0 means unlimited.',
            'bt-metadata-only.name': 'Download Metadata Only',
            'bt-metadata-only.description':
              'Download meta data only. The file(s) described in meta data will not be downloaded. This option has effect only when BitTorrent Magnet URI is used.',
            'bt-min-crypto-level.name': 'Min Crypto Level',
            'bt-min-crypto-level.description':
              'Set minimum level of encryption method. If several encryption methods are provided by a peer, aria2 chooses the lowest one which satisfies the given level.',
            'bt-prioritize-piece.name': 'Prioritize Piece',
            'bt-prioritize-piece.description':
              'Try to download first and last pieces of each file first. This is useful for previewing files. The argument can contain 2 keywords: head and tail. To include both keywords, they must be separated by comma. These keywords can take one parameter, SIZE. For example, if head=SIZE is specified, pieces in the range of first SIZE bytes of each file get higher priority. tail=SIZE means the range of last SIZE bytes of each file. SIZE can include K or M (1K = 1024, 1M = 1024K).',
            'bt-remove-unselected-file.name': 'Remove Unselected File',
            'bt-remove-unselected-file.description':
              'Removes the unselected files when download is completed in BitTorrent. To select files, use --select-file option. If it is not used, all files are assumed to be selected. Please use this option with care because it will actually remove files from your disk.',
            'bt-require-crypto.name': 'Require Crypto',
            'bt-require-crypto.description':
              "If true is given, aria2 doesn't accept and establish connection with legacy BitTorrent handshake(\\19BitTorrent protocol). Thus aria2 always uses Obfuscation handshake.",
            'bt-request-peer-speed-limit.name': 'Preferred Download Speed',
            'bt-request-peer-speed-limit.description':
              'If the whole download speed of every torrent is lower than SPEED, aria2 temporarily increases the number of peers to try for more download speed. Configuring this option with your preferred download speed can increase your download speed in some cases. You can append K or M (1K = 1024, 1M = 1024K).',
            'bt-save-metadata.name': 'Save Metadata',
            'bt-save-metadata.description':
              'Save meta data as ".torrent" file. This option has effect only when BitTorrent Magnet URI is used. The file name is hex encoded info hash with suffix ".torrent". The directory to be saved is the same directory where download file is saved. If the same file already exists, meta data is not saved.',
            'bt-seed-unverified.name': 'Not Verify Downloaded Fileds',
            'bt-seed-unverified.description':
              'Seed previously downloaded files without verifying piece hashes.',
            'bt-stop-timeout.name': 'Stop Timeout',
            'bt-stop-timeout.description':
              'Stop BitTorrent download if download speed is 0 in consecutive SEC seconds. If 0 is given, this feature is disabled.',
            'bt-tracker.name': 'BitTorrent Trackers',
            'bt-tracker.description':
              "Comma separated list of additional BitTorrent tracker's announce URI. These URIs are not affected by --bt-exclude-tracker option because they are added after URIs in --bt-exclude-tracker option are removed.",
            'bt-tracker-connect-timeout.name':
              'BitTorrent Tracker Connect Timeout',
            'bt-tracker-connect-timeout.description':
              'Set the connect timeout in seconds to establish connection to tracker. After the connection is established, this option makes no effect and --bt-tracker-timeout option is used instead.',
            'bt-tracker-interval.name': 'BitTorrent Tracker Connect Interval',
            'bt-tracker-interval.description':
              'Set the interval in seconds between tracker requests. This completely overrides interval value and aria2 just uses this value and ignores the min interval and interval value in the response of tracker. If 0 is set, aria2 determines interval based on the response of tracker and the download progress.',
            'bt-tracker-timeout.name': 'BitTorrent Tracker Timeout',
            'bt-tracker-timeout.description': '',
            'dht-file-path.name': 'DHT (IPv4) File',
            'dht-file-path.description':
              'Change the IPv4 DHT routing table file to PATH.',
            'dht-file-path6.name': 'DHT (IPv6) File',
            'dht-file-path6.description':
              'Change the IPv6 DHT routing table file to PATH.',
            'dht-listen-port.name': 'DHT Listen Port',
            'dht-listen-port.description':
              'Set UDP listening port used by DHT(IPv4, IPv6) and UDP tracker. Multiple ports can be specified by using ,, for example: 6881,6885. You can also use - to specify a range: 6881-6999. , and - can be used together.',
            'dht-message-timeout.name': 'DHT Message Timeout',
            'dht-message-timeout.description': '',
            'enable-dht.name': 'Enable DHT (IPv4)',
            'enable-dht.description':
              "Enable IPv4 DHT functionality. It also enables UDP tracker support. If a private flag is set in a torrent, aria2 doesn't use DHT for that download even if true is given.",
            'enable-dht6.name': 'Enable DHT (IPv6)',
            'enable-dht6.description':
              "Enable IPv6 DHT functionality. If a private flag is set in a torrent, aria2 doesn't use DHT for that download even if true is given. Use --dht-listen-port option to specify port number to listen on.",
            'enable-peer-exchange.name': 'Enable Peer Exchange',
            'enable-peer-exchange.description':
              'Enable Peer Exchange extension. If a private flag is set in a torrent, this feature is disabled for that download even if true is given.',
            'follow-torrent.name': 'Follow Torrent',
            'follow-torrent.description':
              'If true or mem is specified, when a file whose suffix is .torrent or content type is application/x-bittorrent is downloaded, aria2 parses it as a torrent file and downloads files mentioned in it. If mem is specified, a torrent file is not written to the disk, but is just kept in memory. If false is specified, the .torrent file is downloaded to the disk, but is not parsed as a torrent and its contents are not downloaded.',
            'listen-port.name': 'Listen Port',
            'listen-port.description':
              'Set TCP port number for BitTorrent downloads. Multiple ports can be specified by using ,, for example: 6881,6885. You can also use - to specify a range: 6881-6999. , and - can be used together: 6881-6889,6999.',
            'max-overall-upload-limit.name': 'Global Max Upload Limit',
            'max-overall-upload-limit.description':
              'Set max overall upload speed in bytes/sec. 0 means unrestricted. You can append K or M (1K = 1024, 1M = 1024K).',
            'max-upload-limit.name': 'Max Upload Limit',
            'max-upload-limit.description':
              'Set max upload speed per each torrent in bytes/sec. 0 means unrestricted. You can append K or M (1K = 1024, 1M = 1024K).',
            'peer-id-prefix.name': 'Peer ID Prefix',
            'peer-id-prefix.description':
              'Specify the prefix of peer ID. The peer ID in BitTorrent is 20 byte length. If more than 20 bytes are specified, only first 20 bytes are used. If less than 20 bytes are specified, random byte data are added to make its length 20 bytes.',
            'peer-agent.name': 'Peer Agent',
            'peer-agent.description':
              'Specify the string used during the bitorrent extended handshake for the peer’s client version.',
            'seed-ratio.name': 'Min Share Ratio',
            'seed-ratio.description':
              'Specify share ratio. Seed completed torrents until share ratio reaches RATIO. You are strongly encouraged to specify equals or more than 1.0 here. Specify 0.0 if you intend to do seeding regardless of share ratio. If --seed-time option is specified along with this option, seeding ends when at least one of the conditions is satisfied.',
            'seed-time.name': 'Min Seed Time',
            'seed-time.description':
              'Specify seeding time in (fractional) minutes. Specifying --seed-time=0 disables seeding after download completed.',
            'follow-metalink.name': 'Follow Metalink',
            'follow-metalink.description':
              'If true or mem is specified, when a file whose suffix is .meta4 or .metalink or content type of application/metalink4+xml or application/metalink+xml is downloaded, aria2 parses it as a metalink file and downloads files mentioned in it. If mem is specified, a metalink file is not written to the disk, but is just kept in memory. If false is specified, the .metalink file is downloaded to the disk, but is not parsed as a metalink file and its contents are not downloaded.',
            'metalink-base-uri.name': 'Base URI',
            'metalink-base-uri.description':
              'Specify base URI to resolve relative URI in metalink:url and metalink:metaurl element in a metalink file stored in local disk. If URI points to a directory, URI must end with /.',
            'metalink-language.name': 'Language',
            'metalink-language.description': '',
            'metalink-location.name': 'Preferred Server Location',
            'metalink-location.description':
              'The location of the preferred server. A comma-delimited list of locations is acceptable, for example, jp,us.',
            'metalink-os.name': 'Operation System',
            'metalink-os.description':
              'The operating system of the file to download.',
            'metalink-version.name': 'Version',
            'metalink-version.description':
              'The version of the file to download.',
            'metalink-preferred-protocol.name': 'Preferred Protocol',
            'metalink-preferred-protocol.description':
              'Specify preferred protocol. The possible values are http, https, ftp and none. Specify none to disable this feature.',
            'metalink-enable-unique-protocol.name': 'Enable Unique Protocol',
            'metalink-enable-unique-protocol.description':
              'If true is given and several protocols are available for a mirror in a metalink file, aria2 uses one of them. Use --metalink-preferred-protocol option to specify the preference of protocol.',
            'enable-rpc.name': 'Enable JSON-RPC/XML-RPC Server',
            'enable-rpc.description': '',
            'pause-metadata.name': 'Pause After Metadata Downloaded',
            'pause-metadata.description':
              'Pause downloads created as a result of metadata download. There are 3 types of metadata downloads in aria2: (1) downloading .torrent file. (2) downloading torrent metadata using magnet link. (3) downloading metalink file. These metadata downloads will generate downloads using their metadata. This option pauses these subsequent downloads. This option is effective only when --enable-rpc=true is given.',
            'rpc-allow-origin-all.name': 'Allow All Origin Request',
            'rpc-allow-origin-all.description':
              'Add Access-Control-Allow-Origin header field with value * to the RPC response.',
            'rpc-listen-all.name': 'Listen on All Network Interfaces',
            'rpc-listen-all.description':
              'Listen incoming JSON-RPC/XML-RPC requests on all network interfaces. If false is given, listen only on local loopback interface.',
            'rpc-listen-port.name': 'Listen Port',
            'rpc-listen-port.description': '',
            'rpc-max-request-size.name': 'Max Request Size',
            'rpc-max-request-size.description':
              'Set max size of JSON-RPC/XML-RPC request. If aria2 detects the request is more than SIZE bytes, it drops connection.',
            'rpc-save-upload-metadata.name': 'Save Upload Metadata',
            'rpc-save-upload-metadata.description':
              "Save the uploaded torrent or metalink meta data in the directory specified by --dir option. The file name consists of SHA-1 hash hex string of meta data plus extension. For torrent, the extension is '.torrent'. For metalink, it is '.meta4'. If false is given to this option, the downloads added by aria2.addTorrent() or aria2.addMetalink() will not be saved by --save-session option.",
            'rpc-secure.name': 'Enable SSL/TLS',
            'rpc-secure.description':
              'RPC transport will be encrypted by SSL/TLS. The RPC clients must use https scheme to access the server. For WebSocket client, use wss scheme. Use --rpc-certificate and --rpc-private-key options to specify the server certificate and private key.',
            'allow-overwrite.name': 'Allow Overwrite',
            'allow-overwrite.description':
              "Restart download from scratch if the corresponding control file doesn't exist. See also --auto-file-renaming option.",
            'allow-piece-length-change.name': 'Allow Piece Length Change',
            'allow-piece-length-change.description':
              'If false is given, aria2 aborts download when a piece length is different from one in a control file. If true is given, you can proceed but some download progress will be lost.',
            'always-resume.name': 'Always Resume Download',
            'always-resume.description':
              'Always resume download. If true is given, aria2 always tries to resume download and if resume is not possible, aborts download. If false is given, when all given URIs do not support resume or aria2 encounters N URIs which does not support resume (N is the value specified using --max-resume-failure-tries option), aria2 downloads file from scratch. See --max-resume-failure-tries option.',
            'async-dns.name': 'Asynchronous DNS',
            'async-dns.description': '',
            'auto-file-renaming.name': 'Auto File Renaming',
            'auto-file-renaming.description':
              'Rename file name if the same file already exists. This option works only in HTTP(S)/FTP download. The new file name has a dot and a number(1..9999) appended after the name, but before the file extension, if any.',
            'auto-save-interval.name': 'Auto Save Interval',
            'auto-save-interval.description':
              'Save a control file(*.aria2) every SEC seconds. If 0 is given, a control file is not saved during download. aria2 saves a control file when it stops regardless of the value. The possible values are between 0 to 600.',
            'conditional-get.name': 'Conditional Download',
            'conditional-get.description':
              'Download file only when the local file is older than remote file. This function only works with HTTP(S) downloads only. It does not work if file size is specified in Metalink. It also ignores Content-Disposition header. If a control file exists, this option will be ignored. This function uses If-Modified-Since header to get only newer file conditionally. When getting modification time of local file, it uses user supplied file name (see --out option) or file name part in URI if --out is not specified. To overwrite existing file, --allow-overwrite is required.',
            'conf-path.name': 'Configuration File',
            'conf-path.description': '',
            'console-log-level.name': 'Console Log Level',
            'console-log-level.description': '',
            'content-disposition-default-utf8.name':
              'Use UTF-8 to Handle Content-Disposition',
            'content-disposition-default-utf8.description':
              'Handle quoted string in Content-Disposition header as UTF-8 instead of ISO-8859-1, for example, the filename parameter, but not the extended version filename.',
            'daemon.name': 'Enable Daemon',
            'daemon.description': '',
            'deferred-input.name': 'Deferred Load',
            'deferred-input.description':
              'If true is given, aria2 does not read all URIs and options from file specified by --input-file option at startup, but it reads one by one when it needs later. This may reduce memory usage if input file contains a lot of URIs to download. If false is given, aria2 reads all URIs and options at startup. --deferred-input option will be disabled when --save-session is used together.',
            'disable-ipv6.name': 'Disable IPv6',
            'disable-ipv6.description': '',
            'disk-cache.name': 'Disk Cache',
            'disk-cache.description':
              "Enable disk cache. If SIZE is 0, the disk cache is disabled. This feature caches the downloaded data in memory, which grows to at most SIZE bytes. The cache storage is created for aria2 instance and shared by all downloads. The one advantage of the disk cache is reduce the disk I/O because the data are written in larger unit and it is reordered by the offset of the file. If hash checking is involved and the data are cached in memory, we don't need to read them from the disk. SIZE can include K or M (1K = 1024, 1M = 1024K).",
            'download-result.name': 'Download Result',
            'download-result.description':
              'This option changes the way Download Results is formatted. If OPT is default, print GID, status, average download speed and path/URI. If multiple files are involved, path/URI of first requested file is printed and remaining ones are omitted. If OPT is full, print GID, status, average download speed, percentage of progress and path/URI. The percentage of progress and path/URI are printed for each requested file in each row. If OPT is hide, Download Results is hidden.',
            'dscp.name': 'DSCP',
            'dscp.description':
              "Set DSCP value in outgoing IP packets of BitTorrent traffic for QoS. This parameter sets only DSCP bits in TOS field of IP packets, not the whole field. If you take values from /usr/include/netinet/ip.h divide them by 4 (otherwise values would be incorrect, e.g. your CS1 class would turn into CS4). If you take commonly used values from RFC, network vendors' documentation, Wikipedia or any other source, use them as they are.",
            'rlimit-nofile.name': 'Soft Limit of Open File Descriptors',
            'rlimit-nofile.description':
              'Set the soft limit of open file descriptors. This open will only have effect when: a. The system supports it (posix). b. The limit does not exceed the hard limit. c. The specified limit is larger than the current soft limit. This is equivalent to setting nofile via ulimit, except that it will never decrease the limit. This option is only available on systems supporting the rlimit API.',
            'enable-color.name': 'Enable Color in Terminal',
            'enable-color.description': '',
            'enable-mmap.name': 'Enable MMap',
            'enable-mmap.description':
              'Map files into memory. This option may not work if the file space is not pre-allocated. See --file-allocation.',
            'event-poll.name': 'Event Polling Method',
            'event-poll.description':
              'Specify the method for polling events. The possible values are epoll, kqueue, port, poll and select. For each epoll, kqueue, port and poll, it is available if system supports it. epoll is available on recent Linux. kqueue is available on various *BSD systems including Mac OS X. port is available on Open Solaris. The default value may vary depending on the system you use.',
            'file-allocation.name': 'File Allocation Method',
            'file-allocation.description':
              "Specify file allocation method. none doesn't pre-allocate file space. prealloc pre-allocates file space before download begins. This may take some time depending on the size of the file. If you are using newer file systems such as ext4 (with extents support), btrfs, xfs or NTFS(MinGW build only), falloc is your best choice. It allocates large(few GiB) files almost instantly. Don't use falloc with legacy file systems such as ext3 and FAT32 because it takes almost same time as prealloc and it blocks aria2 entirely until allocation finishes. falloc may not be available if your system doesn't have posix_fallocate(3) function. trunc uses ftruncate(2) system call or platform-specific counterpart to truncate a file to a specified length. In multi file torrent downloads, the files adjacent forward to the specified files are also allocated if they share the same piece.",
            'force-save.name': 'Force Save',
            'force-save.description':
              'Save download with --save-session option even if the download is completed or removed. This option also saves control file in that situations. This may be useful to save BitTorrent seeding which is recognized as completed state.',
            'save-not-found.name': 'Save Not Found File',
            'save-not-found.description':
              'Save download with --save-session option even if the file was not found on the server. This option also saves control file in that situations.',
            'hash-check-only.name': 'Hash Check Only',
            'hash-check-only.description':
              'If true is given, after hash check using --check-integrity option, abort download whether or not download is complete.',
            'human-readable.name': 'Console Human Readable Output',
            'human-readable.description':
              'Print sizes and speed in human readable format (e.g., 1.2Ki, 3.4Mi) in the console readout.',
            'keep-unfinished-download-result.name':
              'Keep Unfinished Download Result',
            'keep-unfinished-download-result.description':
              'Keep unfinished download results even if doing so exceeds --max-download-result. This is useful if all unfinished downloads must be saved in session file (see --save-session option). Please keep in mind that there is no upper bound to the number of unfinished download result to keep. If that is undesirable, turn this option off.',
            'max-download-result.name': 'Max Download Result',
            'max-download-result.description':
              'Set maximum number of download result kept in memory. The download results are completed/error/removed downloads. The download results are stored in FIFO queue and it can store at most NUM download results. When queue is full and new download result is created, oldest download result is removed from the front of the queue and new one is pushed to the back. Setting big number in this option may result high memory consumption after thousands of downloads. Specifying 0 means no download result is kept. Note that unfinished downloads are kept in memory regardless of this option value. See --keep-unfinished-download-result option.',
            'max-mmap-limit.name': 'Max MMap Limit',
            'max-mmap-limit.description':
              'Set the maximum file size to enable mmap (see --enable-mmap option). The file size is determined by the sum of all files contained in one download. For example, if a download contains 5 files, then file size is the total size of those files. If file size is strictly greater than the size specified in this option, mmap will be disabled.',
            'max-resume-failure-tries.name': 'Max Resume Failture Try Times',
            'max-resume-failure-tries.description':
              'When used with --always-resume=false, aria2 downloads file from scratch when aria2 detects N number of URIs that does not support resume. If N is 0, aria2 downloads file from scratch when all given URIs do not support resume. See --always-resume option.',
            'min-tls-version.name': 'Min TLS Version',
            'min-tls-version.description':
              'Specify minimum SSL/TLS version to enable.',
            'log-level.name': 'Log Level',
            'log-level.description': '',
            'optimize-concurrent-downloads.name':
              'Optimize Concurrent Downloads',
            'optimize-concurrent-downloads.description':
              'Optimizes the number of concurrent downloads according to the bandwidth available. aria2 uses the download speed observed in the previous downloads to adapt the number of downloads launched in parallel according to the rule N = A + B Log10(speed in Mbps). The coefficients A and B can be customized in the option arguments with A and B separated by a colon. The default values (A=5, B=25) lead to using typically 5 parallel downloads on 1Mbps networks and above 50 on 100Mbps networks. The number of parallel downloads remains constrained under the maximum defined by the --max-concurrent-downloads parameter.',
            'piece-length.name': 'Piece Length',
            'piece-length.description':
              'Set a piece length for HTTP/FTP downloads. This is the boundary when aria2 splits a file. All splits occur at multiple of this length. This option will be ignored in BitTorrent downloads. It will be also ignored if Metalink file contains piece hashes.',
            'show-console-readout.name': 'Show Console Output',
            'show-console-readout.description': '',
            'summary-interval.name': 'Download Summary Output Interval',
            'summary-interval.description':
              'Set interval in seconds to output download progress summary. Setting 0 suppresses the output.',
            'max-overall-download-limit.name': 'Global Max Download Limit',
            'max-overall-download-limit.description':
              'Set max overall download speed in bytes/sec. 0 means unrestricted. You can append K or M (1K = 1024, 1M = 1024K).',
            'max-download-limit.name': 'Max Download Limit',
            'max-download-limit.description':
              'Set max download speed per each download in bytes/sec. 0 means unrestricted. You can append K or M (1K = 1024, 1M = 1024K).',
            'no-conf.name': 'Disable Configuration File',
            'no-conf.description': '',
            'no-file-allocation-limit.name': 'No File Allocation Limit',
            'no-file-allocation-limit.description':
              'No file allocation is made for files whose size is smaller than SIZE. You can append K or M (1K = 1024, 1M = 1024K).',
            'parameterized-uri.name': 'Enable Parameterized URI',
            'parameterized-uri.description':
              'Enable parameterized URI support. You can specify set of parts: http://{sv1,sv2,sv3}/foo.iso. Also you can specify numeric sequences with step counter: http://host/image[000-100:2].img. A step counter can be omitted. If all URIs do not point to the same file, such as the second example above, -Z option is required.',
            'quiet.name': 'Disable Console Output',
            'quiet.description': '',
            'realtime-chunk-checksum.name': 'Realtime Data Chunk Validation',
            'realtime-chunk-checksum.description':
              'Validate chunk of data by calculating checksum while downloading a file if chunk checksums are provided.',
            'remove-control-file.name': 'Remove Control File',
            'remove-control-file.description':
              'Remove control file before download. Using with --allow-overwrite=true, download always starts from scratch. This will be useful for users behind proxy server which disables resume.',
            'save-session.name': 'Session Save File',
            'save-session.description':
              'Save error/unfinished downloads to FILE on exit. You can pass this output file to aria2c with --input-file option on restart. If you like the output to be gzipped append a .gz extension to the file name. Please note that downloads added by aria2.addTorrent() and aria2.addMetalink() RPC method and whose meta data could not be saved as a file are not saved. Downloads removed using aria2.remove() and aria2.forceRemove() will not be saved.',
            'save-session-interval.name': 'Save Session Interval',
            'save-session-interval.description':
              'Save error/unfinished downloads to a file specified by --save-session option every SEC seconds. If 0 is given, file will be saved only when aria2 exits.',
            'socket-recv-buffer-size.name': 'Socket Receive Buffer Size',
            'socket-recv-buffer-size.description':
              'Set the maximum socket receive buffer in bytes. Specifing 0 will disable this option. This value will be set to socket file descriptor using SO_RCVBUF socket option with setsockopt() call.',
            'stop.name': 'Auto Shutdown Time',
            'stop.description':
              'Stop application after SEC seconds has passed. If 0 is given, this feature is disabled.',
            'truncate-console-readout.name': 'Truncate Console Output',
            'truncate-console-readout.description':
              'Truncate console readout to fit in a single line.',
          },
        });
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular
      .module('ariaNg')
      .constant('aria2AllOptions', {
        gid: { type: 'string', readonly: !0, required: !0 },
        dir: { type: 'string', required: !0 },
        log: { type: 'string', required: !0 },
        'max-concurrent-downloads': {
          type: 'integer',
          defaultValue: '5',
          required: !0,
          min: 1,
        },
        'check-integrity': {
          type: 'boolean',
          defaultValue: 'false',
          required: !0,
        },
        continue: { type: 'boolean', required: !0 },
        'all-proxy': { type: 'string' },
        'all-proxy-user': { type: 'string' },
        'all-proxy-passwd': { type: 'string' },
        'connect-timeout': {
          type: 'integer',
          suffix: 'Seconds',
          defaultValue: '60',
          required: !0,
          min: 1,
          max: 600,
        },
        'dry-run': { type: 'boolean', defaultValue: 'false', required: !0 },
        'lowest-speed-limit': {
          type: 'string',
          suffix: 'Bytes',
          defaultValue: '0',
          required: !0,
          pattern: '^(0|[1-9]\\d*(K|k|M|m)?)$',
        },
        'max-connection-per-server': {
          type: 'integer',
          defaultValue: '1',
          required: !0,
          min: 1,
          max: 16,
        },
        'max-file-not-found': {
          type: 'integer',
          defaultValue: '0',
          required: !0,
          min: 0,
        },
        'max-tries': {
          type: 'integer',
          defaultValue: '5',
          required: !0,
          min: 0,
        },
        'min-split-size': {
          type: 'string',
          suffix: 'Bytes',
          defaultValue: '20M',
          required: !0,
          pattern: '^(0|[1-9]\\d*(K|k|M|m)?)$',
        },
        'netrc-path': {
          type: 'string',
          readonly: !0,
          defaultValue: '$(HOME)/.netrc',
        },
        'no-netrc': { type: 'boolean', required: !0 },
        'no-proxy': { type: 'text', split: ',', showCount: !0 },
        out: { type: 'string' },
        'proxy-method': {
          type: 'option',
          options: ['get', 'tunnel'],
          defaultValue: 'get',
          required: !0,
        },
        'remote-time': { type: 'boolean', defaultValue: 'false', required: !0 },
        'reuse-uri': { type: 'boolean', defaultValue: 'true', required: !0 },
        'retry-wait': {
          type: 'integer',
          suffix: 'Seconds',
          defaultValue: '0',
          required: !0,
          min: 0,
          max: 600,
        },
        'server-stat-of': { type: 'string' },
        'server-stat-timeout': {
          type: 'integer',
          suffix: 'Seconds',
          readonly: !0,
          defaultValue: '86400',
        },
        split: { type: 'integer', defaultValue: '5', required: !0, min: 1 },
        'stream-piece-selector': {
          type: 'option',
          options: ['default', 'inorder', 'random', 'geom'],
          defaultValue: 'default',
          required: !0,
        },
        timeout: {
          type: 'integer',
          suffix: 'Seconds',
          defaultValue: '60',
          required: !0,
          min: 1,
          max: 600,
        },
        'uri-selector': {
          type: 'option',
          options: ['inorder', 'feedback', 'adaptive'],
          defaultValue: 'feedback',
          required: !0,
        },
        'check-certificate': {
          type: 'boolean',
          readonly: !0,
          defaultValue: 'true',
        },
        'http-accept-gzip': {
          type: 'boolean',
          defaultValue: 'false',
          required: !0,
        },
        'http-auth-challenge': {
          type: 'boolean',
          defaultValue: 'false',
          required: !0,
        },
        'http-no-cache': {
          type: 'boolean',
          defaultValue: 'false',
          required: !0,
        },
        'http-user': { type: 'string' },
        'http-passwd': { type: 'string' },
        'http-proxy': { type: 'string' },
        'http-proxy-user': { type: 'string' },
        'http-proxy-passwd': { type: 'string' },
        'https-proxy': { type: 'string' },
        'https-proxy-user': { type: 'string' },
        'https-proxy-passwd': { type: 'string' },
        referer: { type: 'string' },
        'enable-http-keep-alive': {
          type: 'boolean',
          defaultValue: 'true',
          required: !0,
        },
        'enable-http-pipelining': {
          type: 'boolean',
          defaultValue: 'false',
          required: !0,
        },
        header: {
          type: 'text',
          split: '\n',
          submitFormat: 'array',
          showCount: !0,
        },
        'save-cookies': { type: 'string' },
        'use-head': { type: 'boolean', defaultValue: 'false', required: !0 },
        'user-agent': { type: 'string', defaultValue: 'aria2/$VERSION' },
        'ftp-user': { type: 'string', defaultValue: 'anonymous' },
        'ftp-passwd': { type: 'string', defaultValue: 'ARIA2USER@' },
        'ftp-pasv': { type: 'boolean', defaultValue: 'true', required: !0 },
        'ftp-proxy': { type: 'string' },
        'ftp-proxy-user': { type: 'string' },
        'ftp-proxy-passwd': { type: 'string' },
        'ftp-type': {
          type: 'option',
          options: ['binary', 'ascii'],
          defaultValue: 'binary',
          required: !0,
        },
        'ftp-reuse-connection': {
          type: 'boolean',
          defaultValue: 'true',
          required: !0,
        },
        'ssh-host-key-md': { type: 'string' },
        'show-files': { type: 'boolean', readonly: !0 },
        'bt-detach-seed-only': {
          type: 'boolean',
          readonly: !0,
          defaultValue: 'false',
        },
        'bt-enable-hook-after-hash-check': {
          since: '1.19.3',
          type: 'boolean',
          defaultValue: 'true',
          required: !0,
        },
        'bt-enable-lpd': {
          type: 'boolean',
          defaultValue: 'false',
          required: !0,
        },
        'bt-exclude-tracker': { type: 'text', split: ',', showCount: !0 },
        'bt-external-ip': { type: 'string' },
        'bt-force-encryption': {
          type: 'boolean',
          defaultValue: 'false',
          required: !0,
        },
        'bt-hash-check-seed': {
          type: 'boolean',
          defaultValue: 'true',
          required: !0,
        },
        'bt-load-saved-metadata': {
          since: '1.33.0',
          type: 'boolean',
          defaultValue: 'false',
          required: !0,
        },
        'bt-max-open-files': {
          type: 'integer',
          defaultValue: '100',
          required: !0,
          min: 1,
        },
        'bt-max-peers': {
          type: 'integer',
          defaultValue: '55',
          required: !0,
          min: 0,
        },
        'bt-metadata-only': {
          type: 'boolean',
          defaultValue: 'false',
          required: !0,
        },
        'bt-min-crypto-level': {
          type: 'option',
          options: ['plain', 'arc4'],
          defaultValue: 'plain',
          required: !0,
        },
        'bt-prioritize-piece': { type: 'string' },
        'bt-remove-unselected-file': {
          type: 'boolean',
          defaultValue: 'false',
          required: !0,
        },
        'bt-require-crypto': {
          type: 'boolean',
          defaultValue: 'false',
          required: !0,
        },
        'bt-request-peer-speed-limit': {
          type: 'string',
          suffix: 'Bytes',
          defaultValue: '50K',
          required: !0,
          pattern: '^(0|[1-9]\\d*(K|k|M|m)?)$',
        },
        'bt-save-metadata': {
          type: 'boolean',
          defaultValue: 'false',
          required: !0,
        },
        'bt-seed-unverified': {
          type: 'boolean',
          defaultValue: 'false',
          required: !0,
        },
        'bt-stop-timeout': {
          type: 'integer',
          suffix: 'Seconds',
          defaultValue: '0',
          required: !0,
          min: 0,
        },
        'bt-tracker': { type: 'text', split: ',', showCount: !0 },
        'bt-tracker-connect-timeout': {
          type: 'integer',
          suffix: 'Seconds',
          defaultValue: '60',
          required: !0,
          min: 1,
          max: 600,
        },
        'bt-tracker-interval': {
          type: 'integer',
          suffix: 'Seconds',
          defaultValue: '0',
          required: !0,
          min: 0,
        },
        'bt-tracker-timeout': {
          type: 'integer',
          suffix: 'Seconds',
          defaultValue: '60',
          required: !0,
          min: 1,
          max: 600,
        },
        'dht-file-path': {
          type: 'string',
          readonly: !0,
          defaultValue: '$HOME/.aria2/dht.dat',
        },
        'dht-file-path6': {
          type: 'string',
          readonly: !0,
          defaultValue: '$HOME/.aria2/dht6.dat',
        },
        'dht-listen-port': {
          type: 'string',
          readonly: !0,
          defaultValue: '6881-6999',
        },
        'dht-message-timeout': {
          type: 'integer',
          suffix: 'Seconds',
          readonly: !0,
          defaultValue: '10',
        },
        'enable-dht': { type: 'boolean', readonly: !0, defaultValue: 'true' },
        'enable-dht6': { type: 'boolean', readonly: !0 },
        'enable-peer-exchange': {
          type: 'boolean',
          defaultValue: 'true',
          required: !0,
        },
        'follow-torrent': {
          type: 'option',
          options: ['true', 'false', 'mem'],
          defaultValue: 'true',
          required: !0,
        },
        'listen-port': {
          type: 'integer',
          readonly: !0,
          defaultValue: '6881-6999',
        },
        'max-overall-upload-limit': {
          type: 'string',
          suffix: 'Bytes',
          defaultValue: '0',
          required: !0,
          pattern: '^(0|[1-9]\\d*(K|k|M|m)?)$',
        },
        'max-upload-limit': {
          type: 'string',
          suffix: 'Bytes',
          defaultValue: '0',
          required: !0,
          pattern: '^(0|[1-9]\\d*(K|k|M|m)?)$',
        },
        'peer-id-prefix': {
          type: 'string',
          readonly: !0,
          defaultValue: 'A2-$MAJOR-$MINOR-$PATCH-',
        },
        'peer-agent': {
          since: '1.33.0',
          type: 'string',
          defaultValue: 'aria2/$MAJOR.$MINOR.$PATCH',
          readonly: !0,
        },
        'seed-ratio': {
          type: 'float',
          defaultValue: '1.0',
          required: !0,
          min: 0,
        },
        'seed-time': { type: 'float', suffix: 'Minutes', required: !0, min: 0 },
        'follow-metalink': {
          type: 'option',
          options: ['true', 'false', 'mem'],
          defaultValue: 'true',
          required: !0,
        },
        'metalink-base-uri': { type: 'string' },
        'metalink-language': { type: 'string' },
        'metalink-location': { type: 'string' },
        'metalink-os': { type: 'string' },
        'metalink-version': { type: 'string' },
        'metalink-preferred-protocol': {
          type: 'option',
          options: ['http', 'https', 'ftp', 'none'],
          defaultValue: 'none',
          required: !0,
        },
        'metalink-enable-unique-protocol': {
          type: 'boolean',
          defaultValue: 'true',
          required: !0,
        },
        'enable-rpc': { type: 'boolean', readonly: !0, defaultValue: 'false' },
        'pause-metadata': {
          type: 'boolean',
          defaultValue: 'false',
          required: !0,
        },
        'rpc-allow-origin-all': {
          type: 'boolean',
          readonly: !0,
          defaultValue: 'false',
        },
        'rpc-listen-all': {
          type: 'boolean',
          readonly: !0,
          defaultValue: 'false',
        },
        'rpc-listen-port': {
          type: 'integer',
          readonly: !0,
          defaultValue: '8080',
        },
        'rpc-max-request-size': {
          type: 'string',
          suffix: 'Bytes',
          readonly: !0,
          defaultValue: '2M',
        },
        'rpc-save-upload-metadata': {
          type: 'boolean',
          defaultValue: 'true',
          required: !0,
        },
        'rpc-secure': { type: 'boolean', readonly: !0 },
        'allow-overwrite': {
          type: 'boolean',
          defaultValue: 'false',
          required: !0,
        },
        'allow-piece-length-change': {
          type: 'boolean',
          defaultValue: 'false',
          required: !0,
        },
        'always-resume': {
          type: 'boolean',
          defaultValue: 'true',
          required: !0,
        },
        'async-dns': { type: 'boolean', defaultValue: 'true', required: !0 },
        'auto-file-renaming': {
          type: 'boolean',
          defaultValue: 'true',
          required: !0,
        },
        'auto-save-interval': {
          type: 'integer',
          suffix: 'Seconds',
          readonly: !0,
          defaultValue: '60',
        },
        'conditional-get': {
          type: 'boolean',
          defaultValue: 'false',
          required: !0,
        },
        'conf-path': {
          type: 'string',
          readonly: !0,
          defaultValue: '/config/aria2/aria2.conf',
        },
        'console-log-level': {
          type: 'option',
          options: ['debug', 'info', 'notice', 'warn', 'error'],
          readonly: !0,
          defaultValue: 'error',
        },
        'content-disposition-default-utf8': {
          since: '1.31.0',
          type: 'boolean',
          defaultValue: 'false',
        },
        daemon: { type: 'boolean', readonly: !0, defaultValue: 'false' },
        'deferred-input': {
          type: 'boolean',
          readonly: !0,
          defaultValue: 'false',
        },
        'disable-ipv6': {
          type: 'boolean',
          readonly: !0,
          defaultValue: 'false',
        },
        'disk-cache': {
          type: 'string',
          suffix: 'Bytes',
          readonly: !0,
          defaultValue: '16M',
        },
        'download-result': {
          type: 'option',
          options: ['default', 'full', 'hide'],
          defaultValue: 'default',
          required: !0,
        },
        dscp: { type: 'string', readonly: !0 },
        'rlimit-nofile': { type: 'string', readonly: !0 },
        'enable-color': { type: 'boolean', readonly: !0, defaultValue: 'true' },
        'enable-mmap': { type: 'boolean', defaultValue: 'false', required: !0 },
        'event-poll': {
          type: 'option',
          options: ['epoll', 'kqueue', 'port', 'poll', 'select'],
          readonly: !0,
        },
        'file-allocation': {
          type: 'option',
          options: ['none', 'prealloc', 'trunc', 'falloc'],
          defaultValue: 'prealloc',
          required: !0,
        },
        'force-save': { type: 'boolean', defaultValue: 'false', required: !0 },
        'save-not-found': {
          since: '1.27.0',
          type: 'boolean',
          defaultValue: 'true',
          required: !0,
        },
        'hash-check-only': {
          type: 'boolean',
          defaultValue: 'false',
          required: !0,
        },
        'human-readable': {
          type: 'boolean',
          readonly: !0,
          defaultValue: 'true',
        },
        'keep-unfinished-download-result': {
          type: 'boolean',
          defaultValue: 'true',
          required: !0,
        },
        'max-download-result': {
          type: 'integer',
          defaultValue: '1000',
          required: !0,
          min: 0,
        },
        'max-mmap-limit': {
          since: '1.20.0',
          type: 'string',
          suffix: 'Bytes',
          defaultValue: '9223372036854775807',
          required: !0,
          pattern: '^(0|[1-9]\\d*(K|k|M|m)?)$',
        },
        'max-resume-failure-tries': {
          type: 'integer',
          defaultValue: '0',
          required: !0,
          min: 0,
        },
        'min-tls-version': {
          type: 'option',
          options: ['SSLv3', 'TLSv1', 'TLSv1.1', 'TLSv1.2'],
          readonly: !0,
          defaultValue: 'TLSv1',
        },
        'log-level': {
          type: 'option',
          options: ['debug', 'info', 'notice', 'warn', 'error'],
          defaultValue: 'debug',
          required: !0,
        },
        'optimize-concurrent-downloads': {
          since: '1.22.0',
          type: 'string',
          defaultValue: 'false',
        },
        'piece-length': {
          type: 'string',
          suffix: 'Bytes',
          defaultValue: '1M',
          required: !0,
          pattern: '^(0|[1-9]\\d*(M|m)?)$',
        },
        'show-console-readout': {
          type: 'boolean',
          readonly: !0,
          defaultValue: 'true',
        },
        'summary-interval': {
          type: 'integer',
          suffix: 'Seconds',
          readonly: !0,
          defaultValue: '60',
        },
        'max-overall-download-limit': {
          type: 'string',
          suffix: 'Bytes',
          defaultValue: '0',
          required: !0,
          pattern: '^(0|[1-9]\\d*(K|k|M|m)?)$',
        },
        'max-download-limit': {
          type: 'string',
          suffix: 'Bytes',
          defaultValue: '0',
          required: !0,
          pattern: '^(0|[1-9]\\d*(K|k|M|m)?)$',
        },
        'no-conf': { type: 'boolean', readonly: !0 },
        'no-file-allocation-limit': {
          type: 'string',
          suffix: 'Bytes',
          defaultValue: '5M',
          required: !0,
          pattern: '^(0|[1-9]\\d*(K|k|M|m)?)$',
        },
        'parameterized-uri': {
          type: 'boolean',
          defaultValue: 'false',
          required: !0,
        },
        quiet: { type: 'boolean', readonly: !0, defaultValue: 'false' },
        'realtime-chunk-checksum': {
          type: 'boolean',
          defaultValue: 'true',
          required: !0,
        },
        'remove-control-file': { type: 'boolean', required: !0 },
        'save-session': { type: 'string' },
        'save-session-interval': {
          type: 'integer',
          suffix: 'Seconds',
          readonly: !0,
          defaultValue: '0',
        },
        'socket-recv-buffer-size': {
          since: '1.19.3',
          type: 'string',
          suffix: 'Bytes',
          readonly: !0,
          defaultValue: '0',
        },
        stop: {
          type: 'integer',
          suffix: 'Seconds',
          readonly: !0,
          defaultValue: '0',
        },
        'truncate-console-readout': {
          type: 'boolean',
          readonly: !0,
          defaultValue: 'true',
        },
      })
      .constant('aria2GlobalAvailableOptions', {
        basicOptions: [
          'dir',
          'log',
          'max-concurrent-downloads',
          'check-integrity',
          'continue',
        ],
        httpFtpSFtpOptions: [
          'all-proxy',
          'all-proxy-user',
          'all-proxy-passwd',
          'connect-timeout',
          'dry-run',
          'lowest-speed-limit',
          'max-connection-per-server',
          'max-file-not-found',
          'max-tries',
          'min-split-size',
          'netrc-path',
          'no-netrc',
          'no-proxy',
          'proxy-method',
          'remote-time',
          'reuse-uri',
          'retry-wait',
          'server-stat-of',
          'server-stat-timeout',
          'split',
          'stream-piece-selector',
          'timeout',
          'uri-selector',
        ],
        httpOptions: [
          'check-certificate',
          'http-accept-gzip',
          'http-auth-challenge',
          'http-no-cache',
          'http-user',
          'http-passwd',
          'http-proxy',
          'http-proxy-user',
          'http-proxy-passwd',
          'https-proxy',
          'https-proxy-user',
          'https-proxy-passwd',
          'referer',
          'enable-http-keep-alive',
          'enable-http-pipelining',
          'header',
          'save-cookies',
          'use-head',
          'user-agent',
        ],
        ftpSFtpOptions: [
          'ftp-user',
          'ftp-passwd',
          'ftp-pasv',
          'ftp-proxy',
          'ftp-proxy-user',
          'ftp-proxy-passwd',
          'ftp-type',
          'ftp-reuse-connection',
          'ssh-host-key-md',
        ],
        btOptions: [
          'bt-detach-seed-only',
          'bt-enable-hook-after-hash-check',
          'bt-enable-lpd',
          'bt-exclude-tracker',
          'bt-external-ip',
          'bt-force-encryption',
          'bt-hash-check-seed',
          'bt-load-saved-metadata',
          'bt-max-open-files',
          'bt-max-peers',
          'bt-metadata-only',
          'bt-min-crypto-level',
          'bt-prioritize-piece',
          'bt-remove-unselected-file',
          'bt-require-crypto',
          'bt-request-peer-speed-limit',
          'bt-save-metadata',
          'bt-seed-unverified',
          'bt-stop-timeout',
          'bt-tracker',
          'bt-tracker-connect-timeout',
          'bt-tracker-interval',
          'bt-tracker-timeout',
          'dht-file-path',
          'dht-file-path6',
          'dht-listen-port',
          'dht-message-timeout',
          'enable-dht',
          'enable-dht6',
          'enable-peer-exchange',
          'follow-torrent',
          'listen-port',
          'max-overall-upload-limit',
          'max-upload-limit',
          'peer-id-prefix',
          'peer-agent',
          'seed-ratio',
          'seed-time',
        ],
        metalinkOptions: [
          'follow-metalink',
          'metalink-base-uri',
          'metalink-language',
          'metalink-location',
          'metalink-os',
          'metalink-version',
          'metalink-preferred-protocol',
          'metalink-enable-unique-protocol',
        ],
        rpcOptions: [
          'enable-rpc',
          'pause-metadata',
          'rpc-allow-origin-all',
          'rpc-listen-all',
          'rpc-listen-port',
          'rpc-max-request-size',
          'rpc-save-upload-metadata',
          'rpc-secure',
        ],
        advancedOptions: [
          'allow-overwrite',
          'allow-piece-length-change',
          'always-resume',
          'async-dns',
          'auto-file-renaming',
          'auto-save-interval',
          'conditional-get',
          'conf-path',
          'console-log-level',
          'content-disposition-default-utf8',
          'daemon',
          'deferred-input',
          'disable-ipv6',
          'disk-cache',
          'download-result',
          'dscp',
          'rlimit-nofile',
          'enable-color',
          'enable-mmap',
          'event-poll',
          'file-allocation',
          'force-save',
          'save-not-found',
          'hash-check-only',
          'human-readable',
          'keep-unfinished-download-result',
          'max-download-result',
          'max-mmap-limit',
          'max-resume-failure-tries',
          'min-tls-version',
          'log-level',
          'optimize-concurrent-downloads',
          'piece-length',
          'show-console-readout',
          'summary-interval',
          'max-overall-download-limit',
          'max-download-limit',
          'no-conf',
          'no-file-allocation-limit',
          'parameterized-uri',
          'quiet',
          'realtime-chunk-checksum',
          'remove-control-file',
          'save-session',
          'save-session-interval',
          'socket-recv-buffer-size',
          'stop',
          'truncate-console-readout',
        ],
      })
      .constant('aria2QuickSettingsAvailableOptions', {
        globalSpeedLimitOptions: [
          'max-overall-download-limit',
          'max-overall-upload-limit',
        ],
      })
      .constant('aria2TaskAvailableOptions', {
        taskOptions: [
          { key: 'dir', category: 'global', canUpdate: 'new', showHistory: !0 },
          { key: 'out', category: 'http', canUpdate: 'new' },
          { key: 'allow-overwrite', category: 'global', canShow: 'new' },
          { key: 'max-download-limit', category: 'global' },
          { key: 'max-upload-limit', category: 'bittorrent' },
          { key: 'split', category: 'http', canUpdate: 'new|waiting|paused' },
          {
            key: 'min-split-size',
            category: 'http',
            canUpdate: 'new|waiting|paused',
          },
          {
            key: 'max-connection-per-server',
            category: 'http',
            canUpdate: 'new|waiting|paused',
          },
          {
            key: 'lowest-speed-limit',
            category: 'http',
            canUpdate: 'new|waiting|paused',
          },
          {
            key: 'stream-piece-selector',
            category: 'http',
            canUpdate: 'new|waiting|paused',
          },
          {
            key: 'http-user',
            category: 'http',
            canUpdate: 'new|waiting|paused',
          },
          {
            key: 'http-passwd',
            category: 'http',
            canUpdate: 'new|waiting|paused',
          },
          {
            key: 'all-proxy',
            category: 'http',
            canUpdate: 'new|waiting|paused',
          },
          {
            key: 'all-proxy-user',
            category: 'http',
            canUpdate: 'new|waiting|paused',
          },
          {
            key: 'all-proxy-passwd',
            category: 'http',
            canUpdate: 'new|waiting|paused',
          },
          { key: 'referer', category: 'http', canUpdate: 'new' },
          { key: 'header', category: 'http', canUpdate: 'new' },
          { key: 'bt-max-peers', category: 'bittorrent' },
          { key: 'bt-request-peer-speed-limit', category: 'bittorrent' },
          { key: 'bt-remove-unselected-file', category: 'bittorrent' },
          {
            key: 'bt-stop-timeout',
            category: 'bittorrent',
            canUpdate: 'new|waiting|paused',
          },
          {
            key: 'bt-tracker',
            category: 'bittorrent',
            canUpdate: 'new|waiting|paused',
          },
          {
            key: 'seed-ratio',
            category: 'bittorrent',
            canUpdate: 'new|waiting|paused',
          },
          {
            key: 'seed-time',
            category: 'bittorrent',
            canUpdate: 'new|waiting|paused',
          },
          { key: 'conditional-get', category: 'global', canShow: 'new' },
          { key: 'file-allocation', category: 'global', canShow: 'new' },
          { key: 'parameterized-uri', category: 'global', canShow: 'new' },
          { key: 'force-save', category: 'global' },
        ],
      });
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').constant('aria2Errors', {
      1: { descriptionKey: 'error.unknown' },
      2: { descriptionKey: 'error.operation.timeout' },
      3: { descriptionKey: 'error.resource.notfound' },
      4: { descriptionKey: 'error.resource.notfound.max-file-not-found' },
      5: { descriptionKey: 'error.download.aborted.lowest-speed-limit' },
      6: { descriptionKey: 'error.network.problem' },
      8: { descriptionKey: 'error.resume.notsupported' },
      9: { descriptionKey: 'error.space.notenough' },
      10: { descriptionKey: 'error.piece.length.different' },
      11: { descriptionKey: 'error.download.sametime' },
      12: { descriptionKey: 'error.download.torrent.sametime' },
      13: { descriptionKey: 'error.file.exists' },
      14: { descriptionKey: 'error.file.rename.failed' },
      15: { descriptionKey: 'error.file.open.failed' },
      16: { descriptionKey: 'error.file.create.failed' },
      17: { descriptionKey: 'error.io.error' },
      18: { descriptionKey: 'error.directory.create.failed' },
      19: { descriptionKey: 'error.name.resolution.failed' },
      20: { descriptionKey: 'error.metalink.file.parse.failed' },
      21: { descriptionKey: 'error.ftp.command.failed' },
      22: { descriptionKey: 'error.http.response.header.bad' },
      23: { descriptionKey: 'error.redirects.toomany' },
      24: { descriptionKey: 'error.http.authorization.failed' },
      25: { descriptionKey: 'error.bencoded.file.parse.failed' },
      26: { descriptionKey: 'error.torrent.file.corrupted' },
      27: { descriptionKey: 'error.magnet.uri.bad' },
      28: { descriptionKey: 'error.option.bad' },
      29: { descriptionKey: 'error.server.overload' },
      30: { descriptionKey: 'error.rpc.request.parse.failed' },
      32: { descriptionKey: 'error.checksum.failed' },
    });
  })(),
  (function () {
    'use strict';
    angular
      .module('ariaNg')
      .constant('aria2RpcConstants', {
        rpcServiceVersion: '2.0',
        rpcServiceName: 'aria2',
        rpcSystemServiceName: 'system',
        rpcTokenPrefix: 'token:',
      })
      .constant('aria2RpcErrors', {
        Unauthorized: {
          message: 'Unauthorized',
          tipTextKey: 'rpc.error.unauthorized',
        },
      });
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').controller('CommandController', [
      '$rootScope',
      '$window',
      '$location',
      '$routeParams',
      'ariaNgDefaultOptions',
      'ariaNgCommonService',
      'ariaNgLocalizationService',
      'ariaNgLogService',
      'ariaNgSettingService',
      'aria2TaskService',
      'aria2SettingService',
      function (s, o, r, e, l, c, d, u, p, g, f) {
        var t,
          a,
          n = r.path(),
          i = angular.extend({}, e, r.search());
        (a = i),
          (0 === (t = n).indexOf('/new')
            ? (function (e, t) {
                try {
                  e = c.base64UrlDecode(e);
                } catch (e) {
                  return d.showError('URL is not base64 encoded!'), !1;
                }
                var a = {},
                  n = !1;
                if (t) {
                  for (var i in t)
                    t.hasOwnProperty(i) &&
                      f.isOptionKeyValid(i) &&
                      (a[i] = t[i]);
                  'true' === t.pause && (n = !0);
                }
                return (
                  (s.loadPromise = g.newUriTask(
                    { urls: [e], options: a },
                    n,
                    function (e) {
                      if (!e.success) return !1;
                      n ? r.path('/waiting') : r.path('/downloading');
                    }
                  )),
                  u.info('[CommandController] new download: ' + e),
                  !0
                );
              })(a.url, a)
            : 0 === t.indexOf('/settings/rpc/set')
              ? (function (e, t, a, n, i) {
                  if (
                    ((a = a || l.rpcPort),
                    (n = n || l.rpcInterface),
                    (i = i || l.secret),
                    u.info(
                      '[CommandController] set rpc: ' +
                        e +
                        '://' +
                        t +
                        ':' +
                        a +
                        '/' +
                        n +
                        ', secret: ' +
                        i
                    ),
                    !e ||
                      ('http' !== e &&
                        'https' !== e &&
                        'ws' !== e &&
                        'wss' !== e))
                  )
                    return d.showError('Protocol is invalid!'), !1;
                  if (!t) return d.showError('RPC host cannot be empty!'), !1;
                  if (i)
                    try {
                      i = c.base64UrlDecode(i);
                    } catch (e) {
                      return (
                        d.showError('RPC secret is not base64 encoded!'), !1
                      );
                    }
                  var s = {
                    rpcAlias: '',
                    rpcHost: t,
                    rpcPort: a,
                    rpcInterface: n,
                    protocol: e,
                    httpMethod: l.httpMethod,
                    secret: i,
                  };
                  return (
                    p.isRpcSettingEqualsDefault(s)
                      ? r.path('/downloading')
                      : (p.setDefaultRpcSetting(s, {
                          keepCurrent: !1,
                          forceSet: !0,
                        }),
                        r.path('/downloading'),
                        o.location.reload()),
                    !0
                  );
                })(a.protocol, a.host, a.port, a.interface, a.secret)
              : (d.showError('Parameter is invalid!'), 0)) ||
            r.path('/downloading');
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').controller('AriaNgDebugController', [
      '$rootScope',
      '$scope',
      '$location',
      '$timeout',
      'ariaNgConstants',
      'ariaNgLocalizationService',
      'ariaNgLogService',
      'ariaNgSettingService',
      function (e, t, a, n, i, s, o, r) {
        (t.logMaxCount = i.cachedDebugLogsLimit),
          (t.currentLog = null),
          (t.enableDebugMode = function () {
            return r.isEnableDebugMode();
          }),
          (t.reloadLogs = function () {
            t.logs = o.getDebugLogs().slice();
          }),
          (t.showLogDetail = function (e) {
            (t.currentLog = e), angular.element('#log-detail-modal').modal();
          }),
          $('#log-detail-modal').on('hide.bs.modal', function (e) {
            t.currentLog = null;
          }),
          (e.loadPromise = n(function () {
            r.isEnableDebugMode()
              ? t.reloadLogs()
              : s.showError('Access Denied!', function () {
                  r.isEnableDebugMode() || a.path('/settings/ariang');
                });
          }, 100));
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').controller('MainController', [
      '$rootScope',
      '$scope',
      '$route',
      '$window',
      '$location',
      '$document',
      '$interval',
      'clipboard',
      'ariaNgBuildConfiguration',
      'aria2RpcErrors',
      'ariaNgCommonService',
      'ariaNgNotificationService',
      'ariaNgLocalizationService',
      'ariaNgSettingService',
      'ariaNgMonitorService',
      'ariaNgTitleService',
      'aria2TaskService',
      'aria2SettingService',
      function (i, s, o, t, r, e, a, n, l, c, d, u, p, g, f, m, h, v) {
        var b = null,
          y = null,
          k = function () {
            e[0].title = m.getFinalTitleByGlobalStat({
              globalStat: s.globalStat,
              currentRpcProfile: S(),
            });
          },
          w = function (e, t) {
            return v.getGlobalStat(function (e) {
              e.success || e.data.message !== c.Unauthorized.message
                ? (e.success &&
                    ((s.globalStat = e.data), f.recordGlobalStat(e.data)),
                  t && t(e))
                : a.cancel(y);
            }, e);
          },
          S = function () {
            if (!s.rpcSettings || s.rpcSettings.length < 1) return null;
            for (var e = 0; e < s.rpcSettings.length; e++) {
              var t = s.rpcSettings[e];
              if (t.isDefault) return t;
            }
            return null;
          };
        g.getBrowserNotification() && u.requestBrowserPermission(),
          (s.ariaNgVersion = l.buildVersion),
          (s.globalStatusContext = {
            isEnabled: 0 < g.getGlobalStatRefreshInterval(),
            data: f.getGlobalStatsData(),
          }),
          (s.enableDebugMode = function () {
            return g.isEnableDebugMode();
          }),
          (s.quickSettingContext = null),
          (s.rpcSettings = g.getAllRpcSettings()),
          (s.isCurrentRpcUseWebSocket = g.isCurrentRpcUseWebSocket()),
          (s.isTaskSelected = function () {
            return 0 < i.taskContext.getSelectedTaskIds().length;
          }),
          (s.isSelectedTasksAllHaveUrl = function () {
            var e = i.taskContext.getSelectedTasks();
            if (e.length < 1) return !1;
            for (var t = 0; t < e.length; t++) if (!e[t].singleUrl) return !1;
            return !0;
          }),
          (s.isSelectedTasksAllHaveInfoHash = function () {
            var e = i.taskContext.getSelectedTasks();
            if (e.length < 1) return !1;
            for (var t = 0; t < e.length; t++)
              if (!e[t].bittorrent || !e[t].infoHash) return !1;
            return !0;
          }),
          (s.isSpecifiedTaskSelected = function () {
            var e = i.taskContext.getSelectedTasks();
            if (e.length < 1) return !1;
            for (var t = 0; t < e.length; t++)
              for (var a = 0; a < arguments.length; a++)
                if (e[t].status === arguments[a]) return !0;
            return !1;
          }),
          (s.isSpecifiedTaskShowing = function () {
            var e = i.taskContext.list;
            if (e.length < 1) return !1;
            for (var t = 0; t < e.length; t++)
              for (var a = 0; a < arguments.length; a++)
                if (e[t].status === arguments[a]) return !0;
            return !1;
          }),
          (s.changeTasksState = function (t) {
            var a = i.taskContext.getSelectedTaskIds();
            if (a && !(a.length < 1)) {
              var e = null;
              if ('start' === t) e = h.startTasks;
              else {
                if ('pause' !== t) return;
                e = h.pauseTasks;
              }
              i.loadPromise = e(
                a,
                function (e) {
                  e.hasError &&
                    1 < a.length &&
                    p.showError('Failed to change some tasks state.'),
                    e.hasSuccess &&
                      (w(!0),
                      e.hasError || 'start' !== t
                        ? e.hasError ||
                          'pause' !== t ||
                          ('/downloading' === r.path()
                            ? r.path('/waiting')
                            : o.reload())
                        : '/waiting' === r.path()
                          ? r.path('/downloading')
                          : o.reload());
                },
                1 < a.length
              );
            }
          }),
          (s.retryTask = function (e) {
            p.confirm(
              'Confirm Retry',
              'Are you sure you want to retry the selected task? AriaNg will create same task after clicking OK.',
              'info',
              function () {
                i.loadPromise = h.retryTask(
                  e.gid,
                  function (e) {
                    if (e.success) {
                      w(!0);
                      var t = g.getAfterRetryingTask();
                      e.success &&
                        e.data &&
                        ('task-list-downloading' === t
                          ? '/downloading' !== r.path()
                            ? r.path('/downloading')
                            : o.reload()
                          : 'task-detail' === t
                            ? r.path('/task/detail/' + e.data)
                            : o.reload());
                    } else p.showError('Failed to retry this task.');
                  },
                  !1
                );
              }
            );
          }),
          (s.hasRetryableTask = function () {
            return i.taskContext.hasRetryableTask();
          }),
          (s.hasCompletedTask = function () {
            return i.taskContext.hasCompletedTask();
          }),
          (s.isSelectedTaskRetryable = function () {
            var e = i.taskContext.getSelectedTasks();
            if (e.length < 1) return !1;
            for (var t = 0; t < e.length; t++)
              if (!i.isTaskRetryable(e[t])) return !1;
            return !0;
          }),
          (s.retryTasks = function () {
            var e = i.taskContext.getSelectedTasks();
            if (e && !(e.length < 1)) {
              if (1 === e.length) return s.retryTask(e[0]);
              for (var t = [], a = 0, n = 0; n < e.length; n++)
                i.isTaskRetryable(e[n]) ? t.push(e[n]) : a++;
              p.confirm(
                'Confirm Retry',
                'Are you sure you want to retry the selected task? AriaNg will create same task after clicking OK.',
                'info',
                function () {
                  i.loadPromise = h.retryTasks(
                    t,
                    function (t) {
                      w(!0),
                        p.showInfo(
                          'Operation Result',
                          '{successCount} tasks have been retried and {failedCount} tasks are failed.',
                          function () {
                            var e = g.getAfterRetryingTask();
                            t.hasSuccess &&
                              ('task-list-downloading' === e &&
                              '/downloading' !== r.path()
                                ? r.path('/downloading')
                                : o.reload());
                          },
                          {
                            textParams: {
                              successCount: t.successCount,
                              failedCount: t.failedCount,
                              skipCount: a,
                            },
                          }
                        );
                    },
                    !1
                  );
                },
                !0
              );
            }
          }),
          (s.removeTasks = function () {
            var t = i.taskContext.getSelectedTasks();
            if (t && !(t.length < 1)) {
              var e = function () {
                i.loadPromise = h.removeTasks(
                  t,
                  function (e) {
                    e.hasError &&
                      1 < t.length &&
                      p.showError('Failed to remove some task(s).'),
                      e.hasSuccess &&
                        (w(!0),
                        e.hasError ||
                          ('/stopped' !== r.path()
                            ? r.path('/stopped')
                            : o.reload()));
                  },
                  1 < t.length
                );
              };
              g.getConfirmTaskRemoval()
                ? p.confirm(
                    'Confirm Remove',
                    'Are you sure you want to remove the selected task?',
                    'warning',
                    e
                  )
                : e();
            }
          }),
          (s.clearStoppedTasks = function () {
            p.confirm(
              'Confirm Clear',
              'Are you sure you want to clear stopped tasks?',
              'warning',
              function () {
                i.loadPromise = h.clearStoppedTasks(function (e) {
                  e.success &&
                    (w(!0),
                    '/stopped' !== r.path() ? r.path('/stopped') : o.reload());
                });
              }
            );
          }),
          (s.isAllTasksSelected = function () {
            return i.taskContext.isAllSelected();
          }),
          (s.selectAllTasks = function () {
            i.taskContext.selectAll();
          }),
          (s.selectAllFailedTasks = function () {
            i.taskContext.selectAllFailed();
          }),
          (s.selectAllCompletedTasks = function () {
            i.taskContext.selectAllCompleted();
          }),
          (s.copySelectedTasksDownloadLink = function () {
            for (
              var e = i.taskContext.getSelectedTasks(), t = '', a = 0;
              a < e.length;
              a++
            )
              0 < a && (t += '\n'), (t += e[a].singleUrl);
            0 < t.length && n.copyText(t);
          }),
          (s.copySelectedTasksMagnetLink = function () {
            for (
              var e = i.taskContext.getSelectedTasks(), t = '', a = 0;
              a < e.length;
              a++
            )
              0 < a && (t += '\n'),
                (t += 'magnet:?xt=urn:btih:' + e[a].infoHash);
            0 < t.length && n.copyText(t);
          }),
          (s.changeDisplayOrder = function (e, t) {
            var a = d.parseOrderType(g.getDisplayOrder()),
              n = d.parseOrderType(e);
            t && n.type === a.type && (n.reverse = !a.reverse),
              g.setDisplayOrder(n.getValue());
          }),
          (s.isSetDisplayOrder = function (e) {
            var t = d.parseOrderType(g.getDisplayOrder()),
              a = d.parseOrderType(e);
            return t.equals(a);
          }),
          (s.showQuickSettingDialog = function (e, t) {
            s.quickSettingContext = { type: e, title: t };
          }),
          (s.switchRpcSetting = function (e) {
            e.isDefault ||
              (g.setDefaultRpcSetting(e),
              0 === r.path().indexOf('/task/detail/')
                ? (i.setAutoRefreshAfterPageLoad(), r.path('/downloading'))
                : t.location.reload());
          }),
          0 < g.getTitleRefreshInterval() &&
            (b = a(function () {
              k();
            }, g.getTitleRefreshInterval())),
          0 < g.getGlobalStatRefreshInterval() &&
            (y = a(function () {
              w(!0);
            }, g.getGlobalStatRefreshInterval())),
          s.$on('$destroy', function () {
            b && a.cancel(b), y && a.cancel(y);
          }),
          w(!0, function () {
            k();
          });
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').controller('NewTaskController', [
      '$rootScope',
      '$scope',
      '$location',
      '$timeout',
      'ariaNgCommonService',
      'ariaNgLocalizationService',
      'ariaNgLogService',
      'ariaNgFileService',
      'ariaNgSettingService',
      'aria2TaskService',
      'aria2SettingService',
      function (l, c, d, e, u, t, a, n, p, g, i) {
        var s,
          o = ['links', 'options'],
          r = d.search(),
          f = function (e) {
            e && e.dir && i.addSettingHistory('dir', e.dir);
          };
        if (
          ((c.context = {
            currentTab: 'links',
            taskType: 'urls',
            urls: '',
            uploadFile: null,
            availableOptions:
              ((s = i.getNewTaskOptionKeys()),
              i.getSpecifiedOptions(s, { disableRequired: !0 })),
            globalOptions: null,
            options: {},
            optionFilter: { global: !0, http: !1, bittorrent: !1 },
          }),
          r.url)
        )
          try {
            c.context.urls = u.base64UrlDecode(r.url);
          } catch (e) {
            a.error('[NewTaskController] base64 decode error, url=' + r.url, e);
          }
        (c.changeTab = function (e) {
          'options' === e && c.loadDefaultOption(), (c.context.currentTab = e);
        }),
          (l.swipeActions.extendLeftSwipe = function () {
            var e = o.indexOf(c.context.currentTab);
            return e < o.length - 1 && (c.changeTab(o[e + 1]), !0);
          }),
          (l.swipeActions.extendRightSwipe = function () {
            var e = o.indexOf(c.context.currentTab);
            return 0 < e && (c.changeTab(o[e - 1]), !0);
          }),
          (c.loadDefaultOption = function () {
            c.context.globalOptions ||
              (l.loadPromise = i.getGlobalOption(function (e) {
                e.success && (c.context.globalOptions = e.data);
              }));
          }),
          (c.openTorrent = function () {
            n.openFileContent(
              { scope: c, fileFilter: '.torrent', fileType: 'binary' },
              function (e) {
                (c.context.uploadFile = e),
                  (c.context.taskType = 'torrent'),
                  c.changeTab('options');
              },
              function (e) {
                t.showError(e);
              },
              angular.element('#file-holder')
            );
          }),
          (c.openMetalink = function () {
            n.openFileContent(
              { scope: c, fileFilter: '.meta4,.metalink', fileType: 'binary' },
              function (e) {
                (c.context.uploadFile = e),
                  (c.context.taskType = 'metalink'),
                  c.changeTab('options');
              },
              function (e) {
                t.showError(e);
              },
              angular.element('#file-holder')
            );
          }),
          (c.startDownload = function (a) {
            var e,
              t,
              n,
              i,
              s,
              o,
              r = function (e) {
                if (e.hasSuccess || e.success) {
                  var t = null;
                  e.results && 0 < e.results.length
                    ? (t = e.results[0])
                    : e && (t = e),
                    'task-detail' === p.getAfterCreatingNewTask() && t && t.data
                      ? d.path('/task/detail/' + t.data)
                      : a
                        ? d.path('/waiting')
                        : d.path('/downloading');
                }
              };
            'urls' === c.context.taskType
              ? (l.loadPromise = (function (e, t) {
                  for (
                    var a = u.parseUrlsFromOriginInput(c.context.urls),
                      n = angular.copy(c.context.options),
                      i = [],
                      s = 0;
                    s < a.length;
                    s++
                  )
                    '' !== a[s] &&
                      '' !== a[s].trim() &&
                      i.push({ urls: [a[s].trim()], options: n });
                  return f(n), g.newUriTasks(i, e, t);
                })(a, r))
              : 'torrent' === c.context.taskType
                ? (l.loadPromise =
                    ((i = a),
                    (s = r),
                    (o = {
                      content: c.context.uploadFile.base64Content,
                      options: angular.copy(c.context.options),
                    }),
                    f(o.options),
                    g.newTorrentTask(o, i, s)))
                : 'metalink' === c.context.taskType &&
                  (l.loadPromise =
                    ((e = a),
                    (t = r),
                    (n = {
                      content: c.context.uploadFile.base64Content,
                      options: angular.copy(c.context.options),
                    }),
                    f(n.options),
                    g.newMetalinkTask(n, e, t)));
          }),
          (c.setOption = function (e, t, a) {
            '' !== t ? (c.context.options[e] = t) : delete c.context.options[e],
              a.setReady();
          }),
          (c.urlTextboxKeyDown = function (e) {
            13 === e.keyCode &&
              e.ctrlKey &&
              c.newTaskForm.$valid &&
              c.startDownload();
          }),
          (c.getValidUrlsCount = function () {
            var e = u.parseUrlsFromOriginInput(c.context.urls);
            return e ? e.length : 0;
          }),
          (l.loadPromise = e(function () {}, 100));
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').controller('DownloadListController', [
      '$rootScope',
      '$scope',
      '$window',
      '$location',
      '$route',
      '$interval',
      'dragulaService',
      'aria2RpcErrors',
      'ariaNgCommonService',
      'ariaNgSettingService',
      'aria2TaskService',
      function (o, e, t, a, n, r, i, l, c, s, d) {
        var u = a.path().substring(1),
          p = null,
          g = !1,
          f = !0,
          m = function (e) {
            if (!g)
              return d.getTaskList(
                u,
                f,
                function (e) {
                  if (!g)
                    if (e.success) {
                      var t = e.context.requestWholeInfo,
                        a = e.data;
                      if (t) (o.taskContext.list = a), (f = !1);
                      else {
                        if (o.taskContext.list && 0 < o.taskContext.list.length)
                          for (var n = 0; n < o.taskContext.list.length; n++) {
                            delete (s = o.taskContext.list[n]).verifiedLength,
                              delete s.verifyIntegrityPending;
                          }
                        f = !c.extendArray(a, o.taskContext.list, 'gid');
                      }
                      if (
                        o.taskContext.list &&
                        0 < o.taskContext.list.length &&
                        (d.processDownloadTasks(o.taskContext.list), !t)
                      ) {
                        var i = !1;
                        for (n = 0; n < o.taskContext.list.length; n++) {
                          var s;
                          if (
                            (s = o.taskContext.list[n]).hasTaskName ||
                            s.files ||
                            s.bittorrent
                          ) {
                            i = !0;
                            break;
                          }
                        }
                        if (!i)
                          return (f = !0), void (o.taskContext.list.length = 0);
                      }
                      o.taskContext.enableSelectAll =
                        o.taskContext.list && 0 < o.taskContext.list.length;
                    } else
                      e.data.message === l.Unauthorized.message && r.cancel(p);
                },
                e
              );
          };
        (e.getOrderType = function () {
          return s.getDisplayOrder();
        }),
          (e.isSupportDragTask = function () {
            if (!s.getDragAndDropTasks()) return !1;
            var e = c.parseOrderType(s.getDisplayOrder());
            return 'waiting' === u && 'default' === e.type;
          }),
          0 < s.getDownloadTaskRefreshInterval() &&
            (p = r(function () {
              m(!0);
            }, s.getDownloadTaskRefreshInterval())),
          i.options(e, 'task-list', {
            revertOnSpill: !0,
            moves: function () {
              return e.isSupportDragTask();
            },
          }),
          e.$on('task-list.drop-model', function (e, t, a) {
            var n = angular.element(t),
              i = n.attr('data-gid'),
              s = n.index();
            (g = !0),
              d.changeTaskPosition(
                i,
                s,
                function () {
                  g = !1;
                },
                !0
              );
          }),
          e.$on('$destroy', function () {
            (g = !0), p && r.cancel(p);
          }),
          (o.loadPromise = m(!1));
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').controller('TaskDetailController', [
      '$rootScope',
      '$scope',
      '$routeParams',
      '$interval',
      'clipboard',
      'aria2RpcErrors',
      'ariaNgFileTypes',
      'ariaNgCommonService',
      'ariaNgSettingService',
      'ariaNgMonitorService',
      'aria2TaskService',
      'aria2SettingService',
      function (o, g, e, t, n, a, f, m, r, l, s, c) {
        var i = [
            { name: 'overview', show: !0 },
            { name: 'pieces', show: !0 },
            { name: 'filelist', show: !0 },
            { name: 'btpeers', show: !0 },
          ],
          d = null,
          u = !1,
          p = null,
          h = function () {
            for (var e = [], t = 0; t < i.length; t++)
              i[t].show && e.push(i[t].name);
            return e;
          },
          v = function (e, t) {
            for (var a = 0; a < i.length; a++)
              if (i[a].name === e) {
                i[a].show = t;
                break;
              }
          },
          b = function (e) {
            var t, a, n, i, s;
            e &&
              ((g.context.showPiecesInfo =
                ((t = e),
                (a = r.getShowPiecesInfoInTaskDetailPage()),
                !(!t || 'never' === a) &&
                  ('le102400' === a
                    ? t.numPieces <= 102400
                    : 'le10240' === a
                      ? t.numPieces <= 10240
                      : 'le1024' !== a || t.numPieces <= 1024))),
              v('pieces', g.context.showPiecesInfo),
              v('btpeers', 'active' === e.status && e.bittorrent),
              (g.task && g.task.status === e.status) ||
                (g.context.availableOptions =
                  ((n = e.status),
                  (i = !!e.bittorrent),
                  (s = c.getAvailableTaskOptionKeys(n, i)),
                  c.getSpecifiedOptions(s, { disableRequired: !0 }))),
              g.task &&
                (delete g.task.verifiedLength,
                delete g.task.verifyIntegrityPending),
              (g.task = m.copyObjectTo(e, g.task)),
              (o.taskContext.list = [g.task]),
              (o.taskContext.selected = {}),
              (o.taskContext.selected[g.task.gid] = !0),
              l.recordStat(e.gid, e));
          },
          y = function (e) {
            e &&
              (m.extendArray(e, g.context.btPeers, 'peerId') ||
                (g.context.btPeers = e),
              (g.context.healthPercent = s.estimateHealthPercentFromPeers(
                g.task,
                g.context.btPeers
              )));
          },
          k = function (e) {
            return e && e.bittorrent && 'active' === e.status;
          },
          w = function (a) {
            if (!u) {
              var n = function (e) {
                t.cancel(d);
              };
              return g.task
                ? s.getTaskStatusAndBtPeers(
                    e.gid,
                    function (e) {
                      if (!e.success) return n(e.data.message);
                      b(e.task), y(e.peers);
                    },
                    a,
                    k(g.task),
                    !0,
                    !0
                  )
                : s.getTaskStatus(
                    e.gid,
                    function (e) {
                      if (!e.success) return n(e.data.message);
                      var t = e.data;
                      b(t),
                        k(t) &&
                          s.getBtTaskPeers(
                            t,
                            function (e) {
                              e.success && y(e.data);
                            },
                            a,
                            !0
                          );
                    },
                    a,
                    !0
                  );
            }
          },
          S = function (e) {
            if (g.task && g.task.files) {
              for (
                var t = g.task.gid, a = [], n = 0;
                n < g.task.files.length;
                n++
              ) {
                var i = g.task.files[n];
                i && i.selected && !i.isDir && a.push(i.index);
              }
              return (
                (u = !0),
                s.selectTaskFile(
                  t,
                  a,
                  function (e) {
                    (u = !1), e.success && w(!1);
                  },
                  e
                )
              );
            }
          },
          x = function (e, t) {
            if (e) {
              if (e.files && e.files.length)
                for (var a = 0; a < e.files.length; a++) {
                  e.files[a].selected = t;
                }
              if (e.subDirs && e.subDirs.length)
                for (a = 0; a < e.subDirs.length; a++) {
                  var n = e.subDirs[a];
                  x(n, t);
                }
              (e.selected = t), (e.partialSelected = !1);
            }
          },
          T = function (e) {
            if (e) {
              var t = 0,
                a = 0;
              if (e.files && e.files.length)
                for (var n = 0; n < e.files.length; n++) {
                  t += e.files[n].selected ? 1 : 0;
                }
              if (e.subDirs && e.subDirs.length)
                for (n = 0; n < e.subDirs.length; n++) {
                  var i = e.subDirs[n];
                  T(i),
                    (t += i.selected ? 1 : 0),
                    (a += i.partialSelected ? 1 : 0);
                }
              (e.selected = 0 < t && t === e.subDirs.length + e.files.length),
                (e.partialSelected =
                  (0 < t && t < e.subDirs.length + e.files.length) || 0 < a);
            }
          },
          C = function () {
            if (g.task && g.task.multiDir)
              for (var e = 0; e < g.task.files.length; e++) {
                var t = g.task.files[e];
                t.isDir && T(t);
              }
          };
        (g.context = {
          currentTab: 'overview',
          isEnableSpeedChart: 0 < r.getDownloadTaskRefreshInterval(),
          showPiecesInfo: 'never' !== r.getShowPiecesInfoInTaskDetailPage(),
          showChooseFilesToolbar: !1,
          fileExtensions: [],
          collapsedDirs: {},
          btPeers: [],
          healthPercent: 0,
          collapseTrackers: !0,
          statusData: l.getEmptyStatsData(e.gid),
          availableOptions: [],
          options: [],
        }),
          (g.changeTab = function (e) {
            'settings' === e && g.loadTaskOption(g.task),
              (g.context.currentTab = e);
          }),
          (o.swipeActions.extendLeftSwipe = function () {
            var e = h(),
              t = e.indexOf(g.context.currentTab);
            return t < e.length - 1 && (g.changeTab(e[t + 1]), !0);
          }),
          (o.swipeActions.extendRightSwipe = function () {
            var e = h(),
              t = e.indexOf(g.context.currentTab);
            return 0 < t && (g.changeTab(e[t - 1]), !0);
          }),
          (g.changeFileListDisplayOrder = function (e, t) {
            if (!g.task || !g.task.multiDir) {
              var a = m.parseOrderType(r.getFileListDisplayOrder()),
                n = m.parseOrderType(e);
              t && n.type === a.type && (n.reverse = !a.reverse),
                r.setFileListDisplayOrder(n.getValue());
            }
          }),
          (g.isSetFileListDisplayOrder = function (e) {
            var t = m.parseOrderType(r.getFileListDisplayOrder()),
              a = m.parseOrderType(e);
            return t.equals(a);
          }),
          (g.getFileListOrderType = function () {
            return g.task && g.task.multiDir
              ? null
              : r.getFileListDisplayOrder();
          }),
          (g.showChooseFilesToolbar = function () {
            g.context.showChooseFilesToolbar
              ? g.cancelChooseFiles()
              : ((u = !0), (g.context.showChooseFilesToolbar = !0));
          }),
          (g.isAnyFileSelected = function () {
            if (!g.task || !g.task.files) return !1;
            for (var e = 0; e < g.task.files.length; e++) {
              var t = g.task.files[e];
              if (!t.isDir && t.selected) return !0;
            }
            return !1;
          }),
          (g.isAllFileSelected = function () {
            if (!g.task || !g.task.files) return !1;
            for (var e = 0; e < g.task.files.length; e++) {
              var t = g.task.files[e];
              if (!t.isDir && !t.selected) return !1;
            }
            return !0;
          }),
          (g.selectFiles = function (e) {
            if (g.task && g.task.files) {
              'auto' === e && (e = g.isAllFileSelected() ? 'none' : 'all');
              for (var t = 0; t < g.task.files.length; t++) {
                var a = g.task.files[t];
                a.isDir ||
                  ('all' === e
                    ? (a.selected = !0)
                    : 'none' === e
                      ? (a.selected = !1)
                      : 'reverse' === e && (a.selected = !a.selected));
              }
              C();
            }
          }),
          (g.chooseSpecifiedFiles = function (e) {
            if (g.task && g.task.files && f[e]) {
              for (
                var t = g.task.files,
                  a = f[e].extensions,
                  n = [],
                  i = !0,
                  s = 0;
                s < t.length;
                s++
              ) {
                if (!(r = t[s]).isDir) {
                  var o = m.getFileExtension(r.fileName);
                  o && (o = o.toLowerCase()),
                    0 <= a.indexOf(o) && (n.push(s), r.selected || (i = !1));
                }
              }
              for (s = 0; s < n.length; s++) {
                var r;
                (r = t[n[s]]) && !r.isDir && (r.selected = !i);
              }
              C();
            }
          }),
          (g.saveChoosedFiles = function () {
            g.context.showChooseFilesToolbar &&
              ((o.loadPromise = S(!1)),
              (g.context.showChooseFilesToolbar = !1));
          }),
          (g.cancelChooseFiles = function () {
            g.context.showChooseFilesToolbar &&
              (w(!(u = !1)), (g.context.showChooseFilesToolbar = !1));
          }),
          (g.showCustomChooseFileModal = function () {
            if (g.task && g.task.files) {
              for (var e = g.task.files, t = {}, a = 0; a < e.length; a++) {
                var n = e[a];
                if (!n.isDir) {
                  if (
                    ((u = m.getFileExtension(n.fileName)) &&
                      (u = u.toLowerCase()),
                    !(p = t[u]))
                  ) {
                    var i = u;
                    0 < i.length && '.' === i.charAt(0) && (i = i.substring(1)),
                      (p = {
                        extension: i,
                        classified: !1,
                        selected: !1,
                        selectedCount: 0,
                        unSelectedCount: 0,
                      }),
                      (t[u] = p);
                  }
                  n.selected
                    ? ((p.selected = !0), p.selectedCount++)
                    : p.unSelectedCount++;
                }
              }
              var s = {};
              for (var o in f)
                if (f.hasOwnProperty(o)) {
                  var r = f[o].name,
                    l = f[o].extensions,
                    c = [];
                  for (a = 0; a < l.length; a++) {
                    (p = t[(u = l[a])]) && ((p.classified = !0), c.push(p));
                  }
                  0 < c.length && (s[o] = { name: r, extensions: c });
                }
              var d = [];
              for (var u in t) {
                var p;
                if (t.hasOwnProperty(u)) (p = t[u]).classified || d.push(p);
              }
              0 < d.length && (s.other = { name: 'Other', extensions: d }),
                (g.context.fileExtensions = s),
                angular.element('#custom-choose-file-modal').modal();
            }
          }),
          (g.setSelectedExtension = function (e, t) {
            if (g.task && g.task.files) {
              for (var a = g.task.files, n = 0; n < a.length; n++) {
                var i = a[n];
                if (!i.isDir) {
                  var s = m.getFileExtension(i.fileName);
                  s && (s = s.toLowerCase()), s === '.' + e && (i.selected = t);
                }
              }
              C();
            }
          }),
          $('#custom-choose-file-modal').on('hide.bs.modal', function (e) {
            g.context.fileExtensions = null;
          }),
          (g.setSelectedFile = function (e) {
            e && C(), g.context.showChooseFilesToolbar || S(!0);
          }),
          (g.collapseDir = function (e, t, a) {
            var n = e.nodePath;
            if (
              (angular.isUndefined(t) && (t = !g.context.collapsedDirs[n]),
              t || a)
            )
              for (var i = 0; i < e.subDirs.length; i++)
                g.collapseDir(e.subDirs[i], t);
            n && (g.context.collapsedDirs[n] = t);
          }),
          (g.collapseAllDirs = function (e) {
            if (g.task && g.task.files)
              for (var t = 0; t < g.task.files.length; t++) {
                var a = g.task.files[t];
                a.isDir && g.collapseDir(a, e, !0);
              }
          }),
          (g.setSelectedNode = function (e) {
            x(e, e.selected),
              C(),
              g.context.showChooseFilesToolbar || g.setSelectedFile(!1);
          }),
          (g.changePeerListDisplayOrder = function (e, t) {
            var a = m.parseOrderType(r.getPeerListDisplayOrder()),
              n = m.parseOrderType(e);
            t && n.type === a.type && (n.reverse = !a.reverse),
              r.setPeerListDisplayOrder(n.getValue());
          }),
          (g.isSetPeerListDisplayOrder = function (e) {
            var t = m.parseOrderType(r.getPeerListDisplayOrder()),
              a = m.parseOrderType(e);
            return t.equals(a);
          }),
          (g.getPeerListOrderType = function () {
            return r.getPeerListDisplayOrder();
          }),
          (g.loadTaskOption = function (e) {
            o.loadPromise = s.getTaskOptions(e.gid, function (e) {
              e.success && (g.context.options = e.data);
            });
          }),
          (g.setOption = function (e, t, a) {
            return s.setTaskOption(
              g.task.gid,
              e,
              t,
              function (e) {
                e.success && 'OK' === e.data
                  ? a.setSuccess()
                  : a.setFailed(e.data.message);
              },
              !0
            );
          }),
          (g.copySelectedRowText = function () {
            if (p) {
              var e = p.find('.setting-key > span').text().trim(),
                a = '';
              if (
                (p.find('.setting-value > span').each(function (e, t) {
                  0 < e && (a += '\n'), (a += angular.element(t).text().trim());
                }),
                r.getIncludePrefixWhenCopyingFromTaskDetails())
              ) {
                var t = e + ': ' + a;
                n.copyText(t);
              } else n.copyText(a);
            }
          }),
          0 < r.getDownloadTaskRefreshInterval() &&
            (d = t(function () {
              !g.task ||
              ('complete' !== g.task.status &&
                'error' !== g.task.status &&
                'removed' !== g.task.status)
                ? w(!0)
                : t.cancel(d);
            }, r.getDownloadTaskRefreshInterval())),
          g.$on('$destroy', function () {
            d && t.cancel(d);
          }),
          (g.onOverviewMouseDown = function () {
            angular
              .element('#overview-items .row[contextmenu-bind!="true"]')
              .contextmenu({
                target: '#task-overview-contextmenu',
                before: function (e, t) {
                  p = t;
                },
              })
              .attr('contextmenu-bind', 'true');
          }),
          angular
            .element('#task-overview-contextmenu')
            .on('hide.bs.context', function () {
              p = null;
            }),
          (o.loadPromise = w(!1));
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').controller('AriaNgSettingsController', [
      '$rootScope',
      '$scope',
      '$routeParams',
      '$window',
      '$interval',
      '$timeout',
      '$filter',
      'clipboard',
      'ariaNgBuildConfiguration',
      'ariaNgLanguages',
      'ariaNgCommonService',
      'ariaNgNotificationService',
      'ariaNgLocalizationService',
      'ariaNgLogService',
      'ariaNgFileService',
      'ariaNgSettingService',
      'ariaNgMonitorService',
      'ariaNgTitleService',
      'aria2SettingService',
      function (t, n, e, a, i, s, o, r, l, c, d, u, p, g, f, m, h, v, b) {
        var y = e.extendType,
          k = null,
          w = function () {
            return v.getFinalTitleByGlobalStat({
              globalStat: h.getCurrentGlobalStat(),
              currentRpcProfile: S(),
            });
          },
          S = function () {
            if (
              !n.context ||
              !n.context.rpcSettings ||
              n.context.rpcSettings.length < 1
            )
              return null;
            for (var e = 0; e < n.context.rpcSettings.length; e++) {
              var t = n.context.rpcSettings[e];
              if (t.isDefault) return t;
            }
            return null;
          },
          x = function () {
            k ||
              (k = p.notifyInPage(
                '',
                'Configuration has been modified, please reload the page for the changes to take effect.',
                {
                  delay: !1,
                  type: 'info',
                  templateUrl: 'views/notification-reloadable.html',
                  onClose: function () {
                    k = null;
                  },
                }
              ));
          };
        (n.context = {
          currentTab: 'global',
          ariaNgVersion: l.buildVersion,
          buildCommit: l.buildCommit,
          languages: c,
          titlePreview: w(),
          availableTime: d.getTimeOptions(
            [1e3, 2e3, 3e3, 5e3, 1e4, 3e4, 6e4],
            !0
          ),
          trueFalseOptions: [
            { name: 'Enabled', value: !0 },
            { name: 'Disabled', value: !1 },
          ],
          showRpcSecret: !1,
          isInsecureProtocolDisabled: m.isInsecureProtocolDisabled(),
          settings: m.getAllOptions(),
          sessionSettings: m.getAllSessionOptions(),
          rpcSettings: m.getAllRpcSettings(),
          isSupportBlob: f.isSupportBlob(),
          isSupportDarkMode: m.isBrowserSupportDarkMode(),
          importSettings: null,
          exportSettings: null,
          exportSettingsCopied: !1,
        }),
          (n.context.titlePreview = w()),
          (n.context.showDebugMode =
            n.context.sessionSettings.debugMode || 'debug' === y),
          (n.changeGlobalTab = function () {
            n.context.currentTab = 'global';
          }),
          (n.isCurrentGlobalTab = function () {
            return 'global' === n.context.currentTab;
          }),
          (n.changeRpcTab = function (e) {
            n.context.currentTab = 'rpc' + e;
          }),
          (n.isCurrentRpcTab = function (e) {
            return n.context.currentTab === 'rpc' + e;
          }),
          (n.getCurrentRpcTabIndex = function () {
            return n.isCurrentGlobalTab()
              ? -1
              : parseInt(n.context.currentTab.substring(3));
          }),
          (n.updateTitlePreview = function () {
            n.context.titlePreview = w();
          }),
          (t.swipeActions.extendLeftSwipe = function () {
            var e = -1;
            return (
              n.isCurrentGlobalTab() ||
                (e = parseInt(n.getCurrentRpcTabIndex())),
              e < n.context.rpcSettings.length - 1 &&
                (n.changeRpcTab(e + 1), !0)
            );
          }),
          (t.swipeActions.extendRightSwipe = function () {
            var e = -1;
            return (
              n.isCurrentGlobalTab() ||
                (e = parseInt(n.getCurrentRpcTabIndex())),
              0 < e
                ? (n.changeRpcTab(e - 1), !0)
                : 0 === e && (n.changeGlobalTab(), !0)
            );
          }),
          (n.isSupportNotification = function () {
            return (
              u.isSupportBrowserNotification() &&
              m.isCurrentRpcUseWebSocket(n.context.settings.protocol)
            );
          }),
          (n.setLanguage = function (e) {
            m.setLanguage(e) && p.applyLanguage(e), n.updateTitlePreview();
          }),
          (n.setTheme = function (e) {
            m.setTheme(e), t.setTheme(e);
          }),
          (n.setDebugMode = function (e) {
            m.setDebugMode(e);
          }),
          (n.setTitle = function (e) {
            m.setTitle(e);
          }),
          (n.setEnableBrowserNotification = function (e) {
            m.setBrowserNotification(e),
              e &&
                !u.hasBrowserPermission() &&
                u.requestBrowserPermission(function (e) {
                  e.granted ||
                    ((n.context.settings.browserNotification = !1),
                    p.showError(
                      "You have disabled notification in your browser. You should change your browser's settings before you enable this function."
                    ));
                });
          }),
          (n.setTitleRefreshInterval = function (e) {
            x(), m.setTitleRefreshInterval(e);
          }),
          (n.setGlobalStatRefreshInterval = function (e) {
            x(), m.setGlobalStatRefreshInterval(e);
          }),
          (n.setDownloadTaskRefreshInterval = function (e) {
            x(), m.setDownloadTaskRefreshInterval(e);
          }),
          (n.setRPCListDisplayOrder = function (e) {
            x(), m.setRPCListDisplayOrder(e);
          }),
          (n.setSwipeGesture = function (e) {
            m.setSwipeGesture(e);
          }),
          (n.setDragAndDropTasks = function (e) {
            m.setDragAndDropTasks(e);
          }),
          (n.setAfterCreatingNewTask = function (e) {
            m.setAfterCreatingNewTask(e);
          }),
          (n.setRemoveOldTaskAfterRetrying = function (e) {
            m.setRemoveOldTaskAfterRetrying(e);
          }),
          (n.setConfirmTaskRemoval = function (e) {
            m.setConfirmTaskRemoval(e);
          }),
          (n.setIncludePrefixWhenCopyingFromTaskDetails = function (e) {
            m.setIncludePrefixWhenCopyingFromTaskDetails(e);
          }),
          (n.setShowPiecesInfoInTaskDetailPage = function (e) {
            m.setShowPiecesInfoInTaskDetailPage(e);
          }),
          (n.setAfterRetryingTask = function (e) {
            m.setAfterRetryingTask(e);
          }),
          (n.showImportSettingsModal = function () {
            (n.context.importSettings = null),
              angular.element('#import-settings-modal').modal();
          }),
          $('#import-settings-modal').on('hide.bs.modal', function (e) {
            n.context.importSettings = null;
          }),
          (n.openAriaNgConfigFile = function () {
            f.openFileContent(
              { scope: n, fileFilter: '.json', fileType: 'text' },
              function (e) {
                n.context.importSettings = e.content;
              },
              function (e) {
                p.showError(e);
              },
              angular.element('#import-file-holder')
            );
          }),
          (n.importSettings = function (e) {
            var t = null;
            try {
              t = JSON.parse(e);
            } catch (e) {
              return (
                g.error(
                  '[AriaNgSettingsController.importSettings] parse settings json error',
                  e
                ),
                void p.showError('Invalid settings data format!')
              );
            }
            if (!angular.isObject(t) || angular.isArray(t))
              return (
                g.error(
                  '[AriaNgSettingsController.importSettings] settings json is not object'
                ),
                void p.showError('Invalid settings data format!')
              );
            t &&
              p.confirm(
                'Confirm Import',
                'Are you sure you want to import all settings?',
                'warning',
                function () {
                  m.importAllOptions(t), a.location.reload();
                }
              );
          }),
          (n.showExportSettingsModal = function () {
            (n.context.exportSettings = o('json')(m.exportAllOptions())),
              (n.context.exportSettingsCopied = !1),
              angular.element('#export-settings-modal').modal();
          }),
          $('#export-settings-modal').on('hide.bs.modal', function (e) {
            (n.context.exportSettings = null),
              (n.context.exportSettingsCopied = !1);
          }),
          (n.copyExportSettings = function () {
            r.copyText(n.context.exportSettings, {
              container: angular.element('#export-settings-modal')[0],
            }),
              (n.context.exportSettingsCopied = !0);
          }),
          (n.addNewRpcSetting = function () {
            x();
            var e = m.addNewRpcSetting();
            n.context.rpcSettings.push(e),
              n.changeRpcTab(n.context.rpcSettings.length - 1);
          }),
          (n.updateRpcSetting = function (e, t) {
            x(), m.updateRpcSetting(e, t);
          }),
          (n.removeRpcSetting = function (a) {
            var e = a.rpcAlias ? a.rpcAlias : a.rpcHost + ':' + a.rpcPort;
            p.confirm(
              'Confirm Remove',
              'Are you sure you want to remove rpc setting "{rpcName}"?',
              'warning',
              function () {
                x();
                var e = n.getCurrentRpcTabIndex(),
                  t = n.context.rpcSettings.indexOf(a);
                m.removeRpcSetting(a),
                  n.context.rpcSettings.splice(t, 1),
                  e >= n.context.rpcSettings.length
                    ? n.changeRpcTab(n.context.rpcSettings.length - 1)
                    : e <= 0 || e <= t || n.changeRpcTab(e - 1);
              },
              !1,
              { textParams: { rpcName: e } }
            );
          }),
          (n.setDefaultRpcSetting = function (e) {
            e.isDefault || (m.setDefaultRpcSetting(e), a.location.reload());
          }),
          (n.resetSettings = function () {
            p.confirm(
              'Confirm Reset',
              'Are you sure you want to reset all settings?',
              'warning',
              function () {
                m.resetSettings(), a.location.reload();
              }
            );
          }),
          (n.clearHistory = function () {
            p.confirm(
              'Confirm Clear',
              'Are you sure you want to clear all settings history?',
              'warning',
              function () {
                b.clearSettingsHistorys(), a.location.reload();
              }
            );
          }),
          angular.element('[data-toggle="popover"]').popover(),
          (t.loadPromise = s(function () {}, 100));
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').controller('Aria2SettingsController', [
      '$rootScope',
      '$scope',
      '$location',
      'ariaNgConstants',
      'ariaNgLocalizationService',
      'aria2SettingService',
      function (e, t, a, n, i, s) {
        var o = a.path().substring(a.path().lastIndexOf('/') + 1);
        (t.context = {
          availableOptions: (function (e) {
            var t = s.getAvailableGlobalOptionsKeys(e);
            if (t) return s.getSpecifiedOptions(t);
            i.showError('Type is illegal!');
          })(o),
          globalOptions: [],
        }),
          (t.setGlobalOption = function (e, t, a) {
            return s.setGlobalOption(
              e,
              t,
              function (e) {
                e.success && 'OK' === e.data
                  ? a.setSuccess()
                  : a.setFailed(e.data.message);
              },
              !0
            );
          }),
          (e.loadPromise = s.getGlobalOption(function (e) {
            e.success && (t.context.globalOptions = e.data);
          }));
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').controller('Aria2StatusController', [
      '$rootScope',
      '$scope',
      'ariaNgLocalizationService',
      'ariaNgSettingService',
      'aria2SettingService',
      function (e, t, a, n, i) {
        (t.context = {
          host: n.getCurrentRpcUrl(),
          status: 'Connecting',
          serverStatus: null,
        }),
          (t.saveSession = function () {
            return i.saveSession(function (e) {
              e.success &&
                'OK' === e.data &&
                a.showOperationSucceeded(
                  'Session has been saved successfully.'
                );
            });
          }),
          (t.shutdown = function () {
            a.confirm(
              'Confirm Shutdown',
              'Are you sure you want to shutdown aria2?',
              'warning',
              function (e) {
                return i.shutdown(function (e) {
                  e.success &&
                    'OK' === e.data &&
                    a.showOperationSucceeded(
                      'Aria2 has been shutdown successfully.'
                    );
                });
              },
              !0
            );
          }),
          (e.loadPromise = i.getAria2Status(function (e) {
            e.success
              ? ((t.context.status = 'Connected'),
                (t.context.serverStatus = e.data))
              : (t.context.status = 'Disconnected');
          }));
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').directive('ngAutoFocus', [
      '$timeout',
      function (a) {
        return {
          restrict: 'A',
          link: function (e, t) {
            a(function () {
              t[0].focus();
            });
          },
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').directive('ngPieceBar', [
      'aria2TaskService',
      function (u) {
        return {
          restrict: 'E',
          template: '<canvas class="piece-bar progress"></canvas>',
          replace: !0,
          scope: { bitField: '=', pieceCount: '=', color: '@' },
          link: function (c, d) {
            var e = function () {
              var e = d[0],
                t = u.getCombinedPieces(c.bitField, c.pieceCount),
                a = e.getContext('2d');
              (a.fillStyle = c.color || '#000'),
                a.clearRect(0, 0, e.width, e.height);
              for (
                var n = 0, i = e.width, s = e.height, o = 0;
                o < t.length;
                o++
              ) {
                var r = t[o],
                  l = (r.count / c.pieceCount) * i;
                r.isCompleted && a.fillRect(n, 0, l, s), (n += l);
              }
            };
            c.$watch('bitField', function () {
              e();
            }),
              c.$watch('pieceNumber', function () {
                e();
              });
          },
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').directive('ngPieceMap', [
      'aria2TaskService',
      function (r) {
        return {
          restrict: 'E',
          template: '<div class="piece-map"></div>',
          replace: !0,
          scope: { bitField: '=', pieceCount: '=' },
          link: function (n, i) {
            var s = [],
              o = [],
              a = function () {
                (o = r.getPieceStatus(n.bitField, n.pieceCount)),
                  (s.length = 0),
                  i.empty();
                for (var e = Math.max(1, o.length), t = 0; t < e; t++) {
                  var a = angular.element(
                    '<div class="piece' +
                      (o[t] ? ' piece-completed' : '') +
                      '"></div>'
                  );
                  s.push(a), i.append(a);
                }
              };
            n.$watch('bitField', function () {
              !(function () {
                var e = r.getPieceStatus(n.bitField, n.pieceCount);
                if (o && e && o.length === e.length && e.length === s.length) {
                  for (var t = 0; t < s.length; t++)
                    o[t] !== e[t] &&
                      (e[t]
                        ? s[t].addClass('piece-completed')
                        : s[t].removeClass('piece-completed'));
                  o = e;
                } else a();
              })();
            }),
              n.$watch('pieceCount', function () {
                a();
              });
          },
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular
      .module('ariaNg')
      .directive('ngChart', [
        '$window',
        'chartTheme',
        function (r, l) {
          return {
            restrict: 'E',
            template: '<div></div>',
            scope: { options: '=ngData', theme: '=ngTheme' },
            link: function (e, t, a) {
              angular.extend({}, a);
              var n = t.find('div'),
                i = t.parent().height(),
                s = parseInt(a.height) || i || 200;
              n.css('height', s + 'px');
              var o = echarts.init(n[0], l.get(e.theme));
              angular.element(r).on('resize', function () {
                o.resize(), e.$apply();
              }),
                e.$watch(
                  'options',
                  function (e) {
                    var t;
                    e && ((t = e), o.setOption(t));
                  },
                  !0
                ),
                e.$on('$destroy', function () {
                  o && !o.isDisposed() && o.dispose();
                });
            },
          };
        },
      ])
      .directive('ngPopChart', [
        '$window',
        'chartTheme',
        function (e, o) {
          return {
            restrict: 'A',
            scope: { options: '=ngData', theme: '=ngTheme' },
            link: function (n, e, i) {
              var t = {
                ngPopoverClass: '',
                ngContainer: 'body',
                ngTrigger: 'click',
                ngPlacement: 'top',
              };
              angular.extend(t, i);
              var s = null,
                a =
                  '<div class="loading"><i class="fa fa-spinner fa-spin fa-2x"></i></div>';
              e.popover({
                container: t.ngContainer,
                content:
                  '<div class="chart-pop-wrapper"><div class="chart-pop ' +
                  t.ngPopoverClass +
                  '">' +
                  a +
                  '</div></div>',
                html: !0,
                placement: t.ngPlacement,
                template:
                  '<div class="popover chart-popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
                trigger: t.ngTrigger,
              })
                .on('shown.bs.popover', function () {
                  var e = angular.element('.chart-pop'),
                    t = e.parent().height();
                  e.empty();
                  var a = parseInt(i.height) || t || 200;
                  e.css('height', a + 'px'),
                    (s = echarts.init(e[0], o.get(n.theme)));
                })
                .on('hide.bs.popover', function () {
                  s && !s.isDisposed() && s.dispose();
                })
                .on('hidden.bs.popover', function () {
                  angular.element('.chart-pop').empty().append(a);
                });
              n.$watch(
                'options',
                function (e) {
                  var t;
                  e && ((t = e), s && !s.isDisposed() && s.setOption(t));
                },
                !0
              );
            },
          };
        },
      ])
      .factory('chartTheme', [
        'chartDefaultTheme',
        'chartDarkTheme',
        function (e, t) {
          var a = { defaultTheme: e, darkTheme: t };
          return {
            get: function (e) {
              return 'default' !== e && a[e + 'Theme']
                ? angular.extend({}, a.defaultTheme, a[e + 'Theme'])
                : a.defaultTheme;
            },
          };
        },
      ])
      .factory('chartDefaultTheme', function () {
        return {
          color: ['#74a329', '#3a89e9'],
          legend: { top: 'bottom' },
          toolbox: { show: !1 },
          tooltip: {
            show: !0,
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            axisPointer: {
              type: 'line',
              lineStyle: { color: '#233333', type: 'dashed', width: 1 },
              crossStyle: { color: '#008acd', width: 1 },
              shadowStyle: { color: 'rgba(200,200,200,0.2)' },
            },
          },
          grid: { x: 40, y: 20, x2: 30, y2: 50 },
          categoryAxis: {
            axisLine: { show: !1 },
            axisTick: { show: !1 },
            splitLine: { lineStyle: { color: '#f3f3f3' } },
          },
          valueAxis: {
            axisLine: { show: !1 },
            axisTick: { show: !1 },
            splitLine: { lineStyle: { color: '#f3f3f3' } },
            splitArea: { show: !1 },
          },
          line: {
            itemStyle: { normal: { lineStyle: { width: 2, type: 'solid' } } },
            smooth: !0,
            symbolSize: 6,
          },
          textStyle: {
            fontFamily:
              'Hiragino Sans GB, Microsoft YaHei, STHeiti, Helvetica Neue, Helvetica, Arial, sans-serif',
          },
          animationDuration: 500,
        };
      })
      .factory('chartDarkTheme', function () {
        return {
          tooltip: {
            show: !0,
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            axisPointer: {
              type: 'line',
              lineStyle: { color: '#ddd', type: 'dashed', width: 1 },
              crossStyle: { color: '#ddd', width: 1 },
              shadowStyle: { color: 'rgba(200,200,200,0.2)' },
            },
          },
          categoryAxis: {
            axisLine: { show: !1 },
            axisTick: { show: !1 },
            splitLine: { lineStyle: { color: '#333' } },
          },
          valueAxis: {
            axisLine: { show: !1 },
            axisTick: { show: !1 },
            axisLabel: { show: !0, textStyle: { color: '#eee' } },
            splitLine: { lineStyle: { color: '#333' } },
            splitArea: { show: !1 },
          },
        };
      });
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').directive('ngIndeterminate', function () {
      return {
        restrict: 'A',
        scope: { indeterminate: '=ngIndeterminate' },
        link: function (e, t) {
          e.$watch('indeterminate', function () {
            t[0].indeterminate =
              'true' === e.indeterminate || !0 === e.indeterminate;
          });
        },
      };
    });
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').directive('ngPlaceholder', function () {
      return {
        restrict: 'A',
        scope: { placeholder: '=ngPlaceholder' },
        link: function (e, t) {
          e.$watch('placeholder', function () {
            t[0].placeholder = e.placeholder;
          });
        },
      };
    });
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').directive('ngSetting', [
      '$timeout',
      '$q',
      'ariaNgConstants',
      'ariaNgLocalizationService',
      'aria2SettingService',
      function (u, p, g, f, m) {
        return {
          restrict: 'E',
          templateUrl: 'views/setting.html',
          require: '?ngModel',
          replace: !0,
          scope: {
            option: '=',
            ngModel: '=',
            defaultValue: '=?',
            onChangeValue: '&',
          },
          link: function (s, i, e, t) {
            var o = null,
              r = {
                lazySaveTimeout: g.lazySaveTimeout,
                errorTooltipDelay: g.errorTooltipDelay,
              };
            angular.extend(r, e);
            var a,
              n = function () {
                s.option &&
                  s.option.showHistory &&
                  (s.history = m.getSettingHistory(s.option.key));
              },
              l = function () {
                angular.element(i).tooltip('destroy');
              },
              c = function (t, a, n) {
                t &&
                  u(function () {
                    var e = s.optionStatus.getValue();
                    ('failed' !== e && 'error' !== e) ||
                      angular
                        .element(i)
                        .tooltip({
                          title: f.getLocalizedText(t, n),
                          trigger: 'focus',
                          placement: 'auto top',
                          container: i,
                          template:
                            '<div class="tooltip' +
                            (a ? ' tooltip-' + a : '') +
                            '" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                        })
                        .tooltip('show');
                  }, r.errorTooltipDelay);
              },
              d = function (e) {
                return 'Bytes' === s.option.suffix
                  ? (function (e) {
                      if (!e || parseInt(e).toString() != e) return e;
                      for (
                        var t = ['', 'K', 'M', 'G'], a = 0, n = 0;
                        n < t.length && !(e < 1024 || e % 1024 != 0);
                        n++
                      )
                        (e /= 1024), a++;
                      return e + t[a];
                    })(e)
                  : e;
              };
            (s.optionStatus =
              ((a = 'ready'),
              {
                getValue: function () {
                  return a;
                },
                setReady: function () {
                  l(), (a = 'ready');
                },
                setPending: function () {
                  l(), (a = 'pending');
                },
                setSaving: function () {
                  l(), (a = 'pending');
                },
                setSuccess: function () {
                  l(), (a = 'success');
                },
                setFailed: function (e) {
                  l(), (a = 'failed'), c(e, 'warning');
                },
                setError: function (e, t) {
                  l(), c(e, (a = 'error'), t);
                },
                getStatusFeedbackStyle: function () {
                  return 'success' === a
                    ? 'has-success'
                    : 'failed' === a
                      ? 'has-warning'
                      : 'error' === a
                        ? 'has-error'
                        : '';
                },
                getStatusIcon: function () {
                  return 'pending' === a
                    ? 'fa-hourglass-start'
                    : 'saving' === a
                      ? 'fa-spin fa-pulse fa-spinner'
                      : 'success' === a
                        ? 'fa-check'
                        : 'failed' === a
                          ? 'fa-exclamation'
                          : 'error' === a
                            ? 'fa-times'
                            : '';
                },
                isShowStatusIcon: function () {
                  return '' !== this.getStatusIcon();
                },
              })),
              (s.getTotalCount = function () {
                return s.optionValue || angular.isString(s.optionValue)
                  ? s.optionValue.split(s.option.split).length
                  : 0;
              }),
              (s.changeValue = function (e, t) {
                if (
                  (o && u.cancel(o),
                  (s.optionValue = e),
                  s.optionStatus.setReady(),
                  s.option && s.option.key && !s.option.readonly)
                )
                  if (s.option.required && '' === e)
                    s.optionStatus.setError('Option value cannot be empty!');
                  else if (
                    '' === e ||
                    'integer' !== s.option.type ||
                    /^-?\d+$/.test(e)
                  )
                    if (
                      '' === e ||
                      'float' !== s.option.type ||
                      /^-?(\d*\.)?\d+$/.test(e)
                    ) {
                      if (
                        '' !== e &&
                        ('integer' === s.option.type ||
                          'float' === s.option.type) &&
                        (angular.isDefined(s.option.min) ||
                          angular.isDefined(s.option.max))
                      ) {
                        var a = e;
                        if (
                          ('integer' === s.option.type
                            ? (a = parseInt(e))
                            : 'float' === s.option.type && (a = parseFloat(e)),
                          angular.isDefined(s.option.min) && a < s.option.min)
                        )
                          return void s.optionStatus.setError(
                            'Input number is below min value!',
                            { value: s.option.min }
                          );
                        if (angular.isDefined(s.option.max) && a > s.option.max)
                          return void s.optionStatus.setError(
                            'Input number is above max value!',
                            { value: s.option.max }
                          );
                      }
                      if (
                        '' === e ||
                        !angular.isDefined(s.option.pattern) ||
                        new RegExp(s.option.pattern).test(e)
                      ) {
                        var n = {
                            key: s.option.key,
                            value: e,
                            optionStatus: s.optionStatus,
                          },
                          i = function () {
                            s.optionStatus.setSaving(), s.onChangeValue(n);
                          };
                        s.onChangeValue &&
                          (t
                            ? (s.optionStatus.setPending(),
                              (o = u(function () {
                                i();
                              }, r.lazySaveTimeout)))
                            : i());
                      } else s.optionStatus.setError('Input value is invalid!');
                    } else s.optionStatus.setError('Input number is invalid!');
                  else s.optionStatus.setError('Input number is invalid!');
              }),
              (s.filterHistory = function (e) {
                var t = [];
                if (s.history && e)
                  for (var a = 0; a < s.history.length; a++)
                    0 === s.history[a].indexOf(e) && t.push(s.history[a]);
                return p.resolve(t);
              }),
              t &&
                s.$watch(
                  function () {
                    return t.$viewValue;
                  },
                  function (e) {
                    s.optionValue = d(e);
                  }
                ),
              s.$watch('option', function () {
                n(), i.find('[data-toggle="popover"]').popover();
              }),
              s.$watch('defaultValue', function (e) {
                var t = e;
                if (s.option && s.option.options)
                  for (var a = 0; a < s.option.options.length; a++) {
                    var n = s.option.options[a];
                    if (n.value === e) {
                      t = n.name;
                      break;
                    }
                  }
                s.placeholder = d(t);
              }),
              n();
          },
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').directive('ngSettingDialog', [
      'ariaNgLocalizationService',
      'aria2SettingService',
      function (i, s) {
        return {
          restrict: 'E',
          templateUrl: 'views/setting-dialog.html',
          replace: !0,
          scope: { setting: '=' },
          link: function (n, e, t) {
            (n.context = {
              isLoading: !1,
              availableOptions: [],
              globalOptions: [],
            }),
              (n.setGlobalOption = function (e, t, a) {
                return s.setGlobalOption(
                  e,
                  t,
                  function (e) {
                    e.success && 'OK' === e.data
                      ? a.setSuccess()
                      : a.setFailed(e.data.message);
                  },
                  !0
                );
              });
            angular
              .element('#quickSettingModal')
              .on('hidden.bs.modal', function () {
                (n.setting = null),
                  (n.context.availableOptions = []),
                  (n.context.globalOptions = []);
              }),
              n.$watch(
                'setting',
                function (e) {
                  var t, a;
                  e &&
                    ((t = e.type),
                    (a = s.getAria2QuickSettingsAvailableOptions(t))
                      ? (n.context.availableOptions = s.getSpecifiedOptions(a))
                      : i.showError('Type is illegal!'),
                    (n.context.isLoading = !0),
                    s.getGlobalOption(function (e) {
                      (n.context.isLoading = !1),
                        e.success && (n.context.globalOptions = e.data);
                    }),
                    angular.element('#quickSettingModal').modal('show'));
                },
                !0
              );
          },
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').directive('ngTooltip', function () {
      return {
        restrict: 'A',
        scope: { title: '@ngTooltip' },
        link: function (e, t, a) {
          var n = {
            ngTooltipIf: !0,
            ngTooltipPlacement: 'top',
            ngTooltipContainer: null,
            ngTooltipTrigger: 'hover',
          };
          angular.extend(n, a);
          var i = !0 === n.ngTooltipIf || 'true' === n.ngTooltipIf,
            s = function () {
              angular.element(t).tooltip({
                title: e.title,
                placement: n.ngTooltipPlacement,
                container: n.ngTooltipContainer,
                trigger: n.ngTooltipTrigger,
                delay: { show: 100, hide: 0 },
              });
            };
          i && s(),
            e.$watch('title', function () {
              i &&
                angular.element(t).attr('title', e.title).tooltip('fixTitle');
            }),
            e.$watch('ngTooltipIf', function (e) {
              angular.isUndefined(e) ||
                (i !== (e = !0 === e || 'true' === e) &&
                  (e ? s() : angular.element(t).tooltip('destroy'), (i = e)));
            });
        },
      };
    });
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').directive('ngValidUrls', [
      'ariaNgCommonService',
      function (i) {
        return {
          restrict: 'A',
          require: '?ngModel',
          link: function (e, t, a, n) {
            e.$watch(
              function () {
                return n.$viewValue;
              },
              function (e) {
                if (!angular.isUndefined(e) && '' !== e) {
                  var t = i.parseUrlsFromOriginInput(e),
                    a = t && 0 < t.length;
                  n.$setValidity('invalidUrls', a);
                }
              }
            );
          },
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').directive('ngBlobDownload', [
      'ariaNgFileService',
      function (n) {
        return {
          restrict: 'A',
          scope: {
            ngBlobDownload: '=ngBlobDownload',
            ngFileName: '@',
            ngContentType: '@',
          },
          link: function (t, a) {
            t.$watch('ngBlobDownload', function (e) {
              e &&
                n.saveFileContent(e, a, {
                  fileName: t.ngFileName,
                  contentType: t.ngContentType,
                });
            });
          },
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').filter('dateDuration', [
      'moment',
      function (i) {
        return function (e, t, a) {
          var n = i.duration(e, t);
          return i.utc(n.asMilliseconds()).format(a);
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').filter('fileOrderBy', [
      '$filter',
      'ariaNgCommonService',
      function (n, i) {
        return function (e, t) {
          if (!angular.isArray(e) || !t) return e;
          var a = i.parseOrderType(t);
          return null === a
            ? e
            : 'index' === a.type
              ? n('orderBy')(e, ['index'], a.reverse)
              : 'name' === a.type
                ? n('orderBy')(e, ['fileName'], a.reverse)
                : 'size' === a.type
                  ? n('orderBy')(e, ['length'], a.reverse)
                  : 'percent' === a.type
                    ? n('orderBy')(e, ['completePercent'], a.reverse)
                    : 'selected' === a.type
                      ? n('orderBy')(e, ['selected'], a.reverse)
                      : e;
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').filter('longDate', [
      'ariaNgCommonService',
      'ariaNgLocalizationService',
      function (a, n) {
        return function (e) {
          var t = n.getLongDateFormat();
          return a.formatDateTime(e, t);
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').filter('peerOrderBy', [
      '$filter',
      'ariaNgCommonService',
      function (n, i) {
        return function (e, t) {
          if (!angular.isArray(e)) return e;
          var a = i.parseOrderType(t);
          return null === a
            ? e
            : 'address' === a.type
              ? n('orderBy')(e, ['ip', 'port'], a.reverse)
              : 'client' === a.type
                ? n('orderBy')(e, ['client.name', 'client.version'], a.reverse)
                : 'percent' === a.type
                  ? n('orderBy')(e, ['completePercent'], a.reverse)
                  : 'dspeed' === a.type
                    ? n('orderBy')(e, ['downloadSpeed'], a.reverse)
                    : 'uspeed' === a.type
                      ? n('orderBy')(e, ['uploadSpeed'], a.reverse)
                      : e;
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').filter('percent', [
      '$filter',
      function (i) {
        return function (e, t) {
          var a = Math.pow(10, t),
            n = parseInt(e * a) / a;
          return i('number')(n, t);
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').filter('reverse', function () {
      return function (e) {
        return e ? e.slice().reverse() : e;
      };
    });
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').filter('taskOrderBy', [
      '$filter',
      'ariaNgCommonService',
      function (n, i) {
        return function (e, t) {
          if (!angular.isArray(e)) return e;
          var a = i.parseOrderType(t);
          return null === a
            ? e
            : 'name' === a.type
              ? n('orderBy')(e, ['taskName'], a.reverse)
              : 'size' === a.type
                ? n('orderBy')(e, ['totalLength'], a.reverse)
                : 'percent' === a.type
                  ? n('orderBy')(e, ['completePercent'], a.reverse)
                  : 'remain' === a.type
                    ? n('orderBy')(
                        e,
                        ['idle', 'remainTime', 'remainLength'],
                        a.reverse
                      )
                    : 'dspeed' === a.type
                      ? n('orderBy')(e, ['downloadSpeed'], a.reverse)
                      : 'uspeed' === a.type
                        ? n('orderBy')(e, ['uploadSpeed'], a.reverse)
                        : e;
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').filter('taskStatus', function () {
      return function (e, t) {
        return e
          ? 'active' === e.status
            ? e.verifyIntegrityPending
              ? 'Pending Verification'
              : e.verifiedLength
                ? e.verifiedPercent
                  ? 'format.task.verifying-percent'
                  : 'Verifying'
                : !0 === e.seeder || 'true' === e.seeder
                  ? 'Seeding'
                  : 'Downloading'
            : 'waiting' === e.status
              ? 'Waiting'
              : 'paused' === e.status
                ? 'Paused'
                : t || 'complete' !== e.status
                  ? t || 'error' !== e.status
                    ? t || 'removed' !== e.status
                      ? ''
                      : 'Removed'
                    : e.errorCode
                      ? 'format.task.error-occurred'
                      : 'Error Occurred'
                  : 'Completed'
          : '';
      };
    });
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').filter('readableVolume', [
      '$filter',
      function (r) {
        var l = ['B', 'KB', 'MB', 'GB'];
        return function (e, t) {
          var a,
            n = l[0],
            i = 2,
            s = !1;
          angular.isNumber(t) ? (i = t) : 'auto' === t && (s = !0),
            e || (e = 0),
            angular.isNumber(e) || (e = parseInt(e));
          for (var o = 1; o < l.length && 1024 <= e; o++)
            (e /= 1024), (n = l[o]);
          return (
            s && (i = (a = e) < 1 ? 2 : a < 10 ? 1 : 0),
            (e = r('number')(e, i)) + ' ' + n
          );
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').provider('ariaNgAssetsCacheService', [
      function () {
        var s = {},
          a = 'languages.';
        (this.getLanguageAsset = function (e) {
          return (function (e) {
            for (var t = e.split('.'), a = s, n = 0; n < t.length; n++) {
              if (angular.isUndefined(a[t[n]])) return null;
              a = a[t[n]];
            }
            return a;
          })(a + e);
        }),
          (this.setLanguageAsset = function (e, t) {
            !(function (e, t) {
              for (var a = e.split('.'), n = s, i = 0; i < a.length - 1; i++)
                angular.isUndefined(n[a[i]]) && (n[a[i]] = {}), (n = n[a[i]]);
              n[a[a.length - 1]] = t;
            })(a + e, t);
          }),
          (this.$get = function () {
            var t = this;
            return {
              getLanguageAsset: function (e) {
                return t.getLanguageAsset(e);
              },
            };
          });
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').factory('ariaNgLanguageLoader', [
      '$http',
      '$q',
      'ariaNgConstants',
      'ariaNgLanguages',
      'ariaNgAssetsCacheService',
      'ariaNgNotificationService',
      'ariaNgLocalizationService',
      'ariaNgLogService',
      'ariaNgStorageService',
      function (o, r, l, c, d, u, p, g, f) {
        var m = function (e) {
            for (var t = 0; t < e.length; t++)
              if (0 < t && '\\' !== e.charAt(t - 1) && '=' === e.charAt(t))
                return {
                  key: e.substring(0, t).replace('\\=', '='),
                  value: e.substring(t + 1, e.length).replace('\\=', '='),
                };
            return { value: e };
          },
          h = function (e, t) {
            var a = e;
            if (!t) return a;
            if (
              ('[' === t[0] &&
                ']' === t[t.length - 1] &&
                (t = t.substring(1, t.length - 1)),
              'global' === t)
            )
              return a;
            for (var n = t.split('.'), i = 0; i < n.length; i++) {
              var s = n[i];
              a[s] || (a[s] = {}), (a = a[s]);
            }
            return a;
          },
          v = function (e) {
            var t = {};
            if (!e) return t;
            for (var a = e.split('\n'), n = t, i = 0; i < a.length; i++) {
              var s = a[i];
              if (s)
                if (((s = s.replace('\r', '')), /^\[.+\]$/.test(s)))
                  n = h(t, s);
                else {
                  var o = m(s);
                  o && o.key && (n[o.key] = o.value);
                }
            }
            return t;
          },
          b = function (e, t) {
            if (!angular.isObject(e) || !angular.isObject(t)) return !1;
            for (var a in t)
              if (t.hasOwnProperty(a)) {
                var n = t[a];
                if (angular.isObject(n)) {
                  if (!b(e[a], n)) return !1;
                } else if (n !== e[a]) return !1;
              }
            return !0;
          };
        return function (t) {
          var n = r.defer();
          if (!c[t.key]) return n.reject(t.key), n.promise;
          var i = l.languageStorageKeyPrefix + '.' + t.key,
            s = f.get(i);
          if ((s && n.resolve(s), d.getLanguageAsset(t.key))) {
            var e = v(d.getLanguageAsset(t.key));
            return f.set(i, e), n.resolve(e), n.promise;
          }
          var a = l.languagePath + '/' + t.key + l.languageFileExtension;
          return (
            o({ url: a, method: 'GET' })
              .then(function (e) {
                var t = v(e.data),
                  a = !1;
                return (
                  s && (a = !b(s, t)),
                  f.set(i, t),
                  a
                    ? (g.info(
                        '[ariaNgLanguageLoader] load language resource successfully, and resource is updated'
                      ),
                      p.notifyInPage(
                        '',
                        'Language resource has been updated, please reload the page for the changes to take effect.',
                        {
                          delay: !1,
                          type: 'info',
                          templateUrl: 'views/notification-reloadable.html',
                        }
                      ))
                    : g.info(
                        '[ariaNgLanguageLoader] load language resource successfully, but resource is not updated'
                      ),
                  n.resolve(t)
                );
              })
              .catch(function (e) {
                return (
                  g.warn('[ariaNgLanguageLoader] cannot get language resource'),
                  s ||
                    u.notifyInPage(
                      '',
                      'AriaNg cannot get language resources, and will display in default language.',
                      { type: 'error', delay: !1 }
                    ),
                  n.reject(t.key)
                );
              }),
            n.promise
          );
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').factory('ariaNgCommonService', [
      '$location',
      '$timeout',
      'base64',
      'moment',
      'SweetAlert',
      'ariaNgConstants',
      function (e, s, t, a, r, n) {
        return {
          base64Encode: function (e) {
            return t.encode(e);
          },
          base64Decode: function (e) {
            return t.decode(e);
          },
          base64UrlDecode: function (e) {
            return t.urldecode(e);
          },
          generateUniqueId: function () {
            var e =
              n.appPrefix +
              '_' +
              Math.round(new Date().getTime() / 1e3) +
              '_' +
              Math.random();
            return this.base64Encode(e);
          },
          showDialog: function (e, t, a, n, i) {
            s(function () {
              r.swal(
                {
                  title: e,
                  text: t,
                  type: a,
                  confirmButtonText: (i && i.confirmButtonText) || null,
                },
                function () {
                  n && n();
                }
              );
            }, 100);
          },
          confirm: function (e, t, a, n, i, s) {
            var o = {
              title: e,
              text: t,
              type: a,
              showCancelButton: !0,
              showLoaderOnConfirm: !!i,
              closeOnConfirm: !i,
              confirmButtonText: (s && s.confirmButtonText) || null,
              cancelButtonText: (s && s.cancelButtonText) || null,
            };
            'warning' === a && (o.confirmButtonColor = '#F39C12'),
              r.swal(o, function (e) {
                e && n && n();
              });
          },
          closeAllDialogs: function () {
            r.close();
          },
          getFileExtension: function (e) {
            return !e || e.lastIndexOf('.') < 0
              ? e
              : e.substring(e.lastIndexOf('.'));
          },
          parseUrlsFromOriginInput: function (e) {
            if (!e) return [];
            for (var t = e.split('\n'), a = [], n = 0; n < t.length; n++) {
              var i = t[n];
              i.match(/^(http|https|ftp|sftp):\/\/.+$/)
                ? a.push(i)
                : i.match(/^magnet:\?.+$/) && a.push(i);
            }
            return a;
          },
          decodePercentEncodedString: function (e) {
            if (!e) return e;
            for (var t = '', a = 0; a < e.length; a++) {
              var n = e.charAt(a);
              if ('%' === n && a < e.length - 2) {
                var i = e.substring(a + 1, a + 3);
                (t += String.fromCharCode(parseInt(i, 16))), (a += 2);
              } else t += n;
            }
            return t;
          },
          extendArray: function (e, t, a) {
            if (!t || !e || e.length !== t.length) return !1;
            for (var n = 0; n < t.length; n++) {
              if (t[n][a] !== e[n][a]) return !1;
              angular.extend(t[n], e[n]);
            }
            return !0;
          },
          copyObjectTo: function (e, t) {
            if (!t) return e;
            for (var a in e)
              if (e.hasOwnProperty(a)) {
                var n = e[a],
                  i = t[a];
                angular.isObject(n) || angular.isArray(n)
                  ? (t[a] = this.copyObjectTo(e[a], t[a]))
                  : n !== i && (t[a] = n);
              }
            return t;
          },
          pushArrayTo: function (e, t) {
            if (
              (angular.isArray(e) || (e = []),
              !angular.isArray(t) || t.length < 1)
            )
              return e;
            for (var a = 0; a < t.length; a++) e.push(t[a]);
            return e;
          },
          combineArray: function () {
            for (var e = [], t = 0; t < arguments.length; t++)
              angular.isArray(arguments[t])
                ? this.pushArrayTo(e, arguments[t])
                : e.push(arguments[t]);
            return e;
          },
          countArray: function (e, t) {
            if (!angular.isArray(e) || e.length < 1) return 0;
            for (var a = 0, n = 0; n < e.length; n++) a += e[n] === t ? 1 : 0;
            return a;
          },
          parseOrderType: function (e) {
            var t = e.split(':'),
              a = {
                type: t[0],
                order: t[1],
                equals: function (e) {
                  return angular.isUndefined(e.order)
                    ? this.type === e.type
                    : this.type === e.type && this.order === e.order;
                },
                getValue: function () {
                  return this.type + ':' + this.order;
                },
              };
            return (
              Object.defineProperty(a, 'reverse', {
                get: function () {
                  return 'desc' === this.order;
                },
                set: function (e) {
                  this.order = e ? 'desc' : 'asc';
                },
              }),
              a
            );
          },
          getCurrentUnixTime: function () {
            return a().format('X');
          },
          getLongTimeFromUnixTime: function (e) {
            return a(e, 'X').format('HH:mm:ss');
          },
          formatDateTime: function (e, t) {
            return a(e).format(t);
          },
          getTimeOptions: function (e, t) {
            var a = [];
            if (
              (t && a.push({ name: 'Disabled', value: 0, optionValue: 0 }),
              !angular.isArray(e) || e.length < 1)
            )
              return a;
            for (var n = 0; n < e.length; n++) {
              var i = e[n],
                s = '',
                o = i;
              (s =
                i < 1e3
                  ? 1 === (o = i)
                    ? 'format.time.millisecond'
                    : 'format.time.milliseconds'
                  : i < 6e4
                    ? 1 === (o = i / 1e3)
                      ? 'format.time.second'
                      : 'format.time.seconds'
                    : i < 144e4
                      ? 1 === (o = i / 1e3 / 60)
                        ? 'format.time.minute'
                        : 'format.time.minutes'
                      : 1 === (o = i / 1e3 / 60 / 24)
                        ? 'format.time.hour'
                        : 'format.time.hours'),
                a.push({ name: s, value: o, optionValue: i });
            }
            return a;
          },
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').factory('ariaNgNotificationService', [
      '$window',
      'Notification',
      'ariaNgSettingService',
      function (s, n, o) {
        var r = !!s.Notification,
          l = function (e) {
            return 'granted' === e;
          },
          c = function () {
            return s.Notification ? s.Notification.permission : null;
          };
        return {
          isSupportBrowserNotification: function () {
            return r;
          },
          hasBrowserPermission: function () {
            return !!r && l(c());
          },
          requestBrowserPermission: function (t) {
            var a;
            r &&
              ((a = function (e) {
                e.granted || o.setBrowserNotification(!1), t && t(e);
              }),
              s.Notification &&
                s.Notification.requestPermission(function (e) {
                  a && a({ granted: l(e), permission: e });
                }));
          },
          notifyViaBrowser: function (e, t, a) {
            var n, i;
            a || (a = {}),
              (a.body = t),
              r &&
                o.getBrowserNotification() &&
                ((n = e),
                (i = a),
                s.Notification &&
                  l(c()) &&
                  ((i = angular.extend({ icon: 'tileicon.png' }, i)),
                  new s.Notification(n, i)));
          },
          notifyInPage: function (e, t, a) {
            return (
              a || (a = {}),
              t ? ((a.title = e), (a.message = t)) : (a.message = e),
              (a.type && n[a.type]) || (a.type = 'primary'),
              n[a.type](a)
            );
          },
          clearNotificationInPage: function () {
            n.clearAll();
          },
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').factory('ariaNgLocalizationService', [
      '$translate',
      'amMoment',
      'ariaNgCommonService',
      'ariaNgNotificationService',
      function (a, t, o, n) {
        return {
          applyLanguage: function (e) {
            return a.use(e), t.changeLocale(e), !0;
          },
          getLocalizedText: function (e, t) {
            return a.instant(e, t);
          },
          getLongDateFormat: function () {
            return this.getLocalizedText('format.longdate');
          },
          showDialog: function (e, t, a, n, i) {
            i || (i = {}),
              e && (e = this.getLocalizedText(e)),
              t && (t = this.getLocalizedText(t, i.textParams)),
              (i.confirmButtonText = this.getLocalizedText('OK')),
              o.showDialog(e, t, a, n, i);
          },
          showInfo: function (e, t, a, n) {
            this.showDialog(e, t, 'info', a, n);
          },
          showError: function (e, t) {
            this.showDialog('Error', e, 'error', t);
          },
          showOperationSucceeded: function (e, t) {
            this.showDialog('Operation Succeeded', e, 'success', t);
          },
          confirm: function (e, t, a, n, i, s) {
            s || (s = {}),
              e && (e = this.getLocalizedText(e)),
              t && (t = this.getLocalizedText(t, s.textParams)),
              (s.confirmButtonText = this.getLocalizedText('OK')),
              (s.cancelButtonText = this.getLocalizedText('Cancel')),
              o.confirm(e, t, a, n, i, s);
          },
          notifyViaBrowser: function (e, t, a) {
            return (
              e && (e = this.getLocalizedText(e)),
              t && (t = this.getLocalizedText(t)),
              n.notifyViaBrowser(e, t, a)
            );
          },
          notifyInPage: function (e, t, a) {
            return (
              a || (a = {}),
              e && (e = this.getLocalizedText(e, a.titleParams)),
              t &&
                ((t = this.getLocalizedText(t, a.contentParams)),
                a.contentPrefix && (t = a.contentPrefix + t)),
              n.notifyInPage(e, t, a)
            );
          },
          notifyTaskComplete: function (e) {
            this.notifyViaBrowser(
              'Download Completed',
              e && e.taskName ? e.taskName : ''
            );
          },
          notifyBtTaskComplete: function (e) {
            this.notifyViaBrowser(
              'BT Download Completed',
              e && e.taskName ? e.taskName : ''
            );
          },
          notifyTaskError: function (e) {
            this.notifyViaBrowser(
              'Download Error',
              e && e.taskName ? e.taskName : ''
            );
          },
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').factory('ariaNgLogService', [
      '$log',
      'ariaNgConstants',
      function (a, o) {
        var r = !1,
          l = [],
          n = function (e, t, a) {
            var n, i, s;
            r &&
              (l.length >= o.cachedDebugLogsLimit && l.shift(),
              l.push(
                ((n = e),
                (i = t),
                (s = a),
                { time: new Date(), level: i, content: n, attachment: s })
              ));
          };
        return {
          setEnableDebugLog: function (e) {
            r = e;
          },
          debug: function (e, t) {
            r &&
              (t
                ? a.debug('[AriaNg Debug]' + e, t)
                : a.debug('[AriaNg Debug]' + e),
              n(e, 'DEBUG', t));
          },
          info: function (e, t) {
            t ? a.info('[AriaNg Info]' + e, t) : a.info('[AriaNg Info]' + e),
              n(e, 'INFO', t);
          },
          warn: function (e, t) {
            t ? a.warn('[AriaNg Warn]' + e, t) : a.warn('[AriaNg Warn]' + e),
              n(e, 'WARN', t);
          },
          error: function (e, t) {
            t
              ? a.error('[AriaNg Error]' + e, t)
              : a.error('[AriaNg Error]' + e),
              n(e, 'ERROR', t);
          },
          getDebugLogs: function () {
            return r ? l : [];
          },
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').factory('ariaNgStorageService', [
      '$window',
      'localStorageService',
      function (e, i) {
        return {
          isLocalStorageSupported: function () {
            return i.isSupported;
          },
          isCookiesSupported: function () {
            return i.cookie.isSupported;
          },
          get: function (e) {
            return i.get(e);
          },
          set: function (e, t) {
            return i.set(e, t);
          },
          remove: function (e) {
            return i.remove(e);
          },
          clearAll: function () {
            return i.clearAll();
          },
          keys: function (e) {
            var t = i.keys();
            if (!t || !t.length || !e) return t;
            for (var a = [], n = 0; n < t.length; n++)
              0 <= t[n].indexOf(e) && a.push(t[n]);
            return a;
          },
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').factory('ariaNgFileService', [
      '$window',
      function (e) {
        var n = !!e.FileReader,
          s = !!e.Blob;
        return {
          isSupportFileReader: function () {
            return n;
          },
          isSupportBlob: function () {
            return s;
          },
          openFileContent: function (e, t, a, s) {
            n
              ? ((e = angular.extend(
                  {
                    scope: null,
                    fileFilter: null,
                    fileType: 'binary',
                    successCallback: t,
                    errorCallback: a,
                  },
                  e
                )),
                (s && s.change) ||
                  (s = angular.element(
                    '<input type="file" style="display: none"/>'
                  )),
                s.data('options', e),
                e.fileFilter && s.attr('accept', e.fileFilter),
                s.val(''),
                'true' !== s.attr('data-ariang-file-initialized') &&
                  s
                    .change(function () {
                      if (this.files && !(this.files.length < 1)) {
                        var t = s.data('options'),
                          e = (function (e) {
                            var t = [];
                            if (!e || e.length < 1) return t.push(/.+$/), t;
                            for (
                              var a = e.split(','), n = 0;
                              n < a.length;
                              n++
                            ) {
                              var i = a[n];
                              '*.*' !== i
                                ? ((i = i.replace('.', '\\.')),
                                  (i += '$'),
                                  t.push(new RegExp(i)))
                                : t.push(/.+$/);
                            }
                            return t;
                          })(t.fileFilter),
                          a = this.files[0],
                          n = a.name;
                        if (
                          (function (e, t) {
                            if (!t || t.length < 1) return !0;
                            for (var a = 0; a < t.length; a++)
                              if (t[a].test(e)) return !0;
                            return !1;
                          })(n, e)
                        ) {
                          var i = new FileReader();
                          switch (
                            ((i.onload = function () {
                              var e = { fileName: n };
                              switch (t.fileType) {
                                case 'text':
                                  e.content = this.result;
                                  break;
                                case 'binary':
                                default:
                                  e.base64Content = this.result.replace(
                                    /.*?base64,/,
                                    ''
                                  );
                              }
                              t.successCallback &&
                                (t.scope
                                  ? t.scope.$apply(function () {
                                      t.successCallback(e);
                                    })
                                  : t.successCallback(e));
                            }),
                            (i.onerror = function () {
                              t.errorCallback &&
                                (t.scope
                                  ? t.scope.$apply(function () {
                                      t.errorCallback('Failed to load file!');
                                    })
                                  : t.errorCallback('Failed to load file!'));
                            }),
                            t.fileType)
                          ) {
                            case 'text':
                              i.readAsText(a);
                              break;
                            case 'binary':
                            default:
                              i.readAsDataURL(a);
                          }
                        } else
                          t.errorCallback &&
                            (t.scope
                              ? t.scope.$apply(function () {
                                  t.errorCallback(
                                    'The selected file type is invalid!'
                                  );
                                })
                              : t.errorCallback(
                                  'The selected file type is invalid!'
                                ));
                      }
                    })
                    .attr('data-ariang-file-initialized', 'true'),
                s.trigger('click'))
              : a && a('Your browser does not support loading file!');
          },
          saveFileContent: function (e, t, a) {
            if (s) {
              a = angular.extend(
                {
                  fileName: null,
                  contentType: 'application/octet-stream',
                  autoTrigger: !1,
                  autoRevoke: !1,
                },
                a
              );
              var n = new Blob([e], { type: a.contentType }),
                i = URL.createObjectURL(n);
              t || (t = angular.element('<a style="display: none"/>')),
                t.attr('href', i),
                a.fileName && t.attr('download', a.fileName),
                a.autoTrigger && t.trigger('click'),
                a.autoRevoke && URL.revokeObjectURL(i);
            }
          },
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').factory('ariaNgSettingService', [
      '$window',
      '$location',
      '$filter',
      'ariaNgConstants',
      'ariaNgDefaultOptions',
      'ariaNgLanguages',
      'ariaNgCommonService',
      'ariaNgLogService',
      'ariaNgStorageService',
      function (n, t, e, i, o, s, r, l, c) {
        var a = {
            localStroage: c.isLocalStorageSupported(),
            cookies: c.isCookiesSupported(),
          },
          d = a.localStroage || a.cookies,
          u = !!n.applicationCache,
          p =
            !!n.matchMedia &&
            n.matchMedia('(prefers-color-scheme: dark)') &&
            'not all' !== n.matchMedia('(prefers-color-scheme: dark)').media &&
            angular.isFunction(
              n.matchMedia('(prefers-color-scheme: dark)').addEventListener
            ),
          g = [],
          f = [],
          m = !1,
          h = { debugMode: !1 };
        u &&
          n.applicationCache.addEventListener(
            'updateready',
            function (e) {
              for (var t = 0; t < g.length; t++) {
                (0, g[t])();
              }
            },
            !1
          );
        var v = function () {
            return 'https' === t.protocol();
          },
          b = function (e) {
            for (var t in s)
              if (s.hasOwnProperty(t)) {
                if (t.toLowerCase() === e.toLowerCase()) return t;
                var a = s[t].aliases;
                if (angular.isArray(a) && !(a.length < 1))
                  for (var n = 0; n < a.length; n++)
                    if (a[n].toLowerCase() === e.toLowerCase()) return t;
              }
            return null;
          },
          y = function () {
            var e = n.navigator.browserLanguage
              ? n.navigator.browserLanguage
              : n.navigator.language;
            if (!e)
              return (
                l.info(
                  '[ariaNgSettingService] cannot get browser language, use default language'
                ),
                o.language
              );
            ((e = e.replace(/\-/g, '_')), s[e]) || ((t = b(e)) && (e = t));
            if (!s[e] && 1 < e.split('-').length) {
              var t,
                a = e.split('-');
              if (((e = a[0] + '-' + a[1]), !s[e])) (t = b(e)) && (e = t);
            }
            return s[e]
              ? (l.info(
                  '[ariaNgSettingService] use browser language "' +
                    e +
                    '" as current language'
                ),
                e)
              : (l.info(
                  '[ariaNgSettingService] browser language "' +
                    e +
                    '" not support, use default language'
                ),
                o.language);
          },
          k = function (e) {
            return c.set(i.optionStorageKey, e);
          },
          w = function () {
            var e,
              t = c.get(i.optionStorageKey);
            if (
              (t &&
                !s[t.language] &&
                (t.language = ((e = t.language), b(e) || y())),
              !t)
            ) {
              if (
                (((t = angular.extend({}, o)).language = y()),
                t.rpcHost || T(t),
                angular.isArray(t.extendRpcServers))
              )
                for (var a = 0; a < t.extendRpcServers.length; a++) {
                  var n = t.extendRpcServers[a];
                  n.rpcHost || T(n);
                }
              k(t),
                (function () {
                  if (d && !(m || !angular.isArray(f) || f.length < 1)) {
                    for (var e = 0; e < f.length; e++) (0, f[e])();
                    m = !0;
                  }
                })();
            }
            return t;
          },
          S = function (e) {
            var t = w();
            return (
              angular.isUndefined(t[e]) &&
                angular.isDefined(o[e]) &&
                ((t[e] = o[e]), k(t)),
              t[e]
            );
          },
          x = function (e, t) {
            var a = w();
            (a[e] = t), k(a);
          },
          T = function (e) {
            (e.rpcHost = t.host() || i.defaultHost),
              v() && (e.protocol = i.defaultSecureProtocol);
          },
          C = function (e) {
            return {
              rpcAlias: e.rpcAlias,
              rpcHost: e.rpcHost,
              rpcPort: e.rpcPort,
              rpcInterface: e.rpcInterface,
              protocol: e.protocol,
              httpMethod: e.httpMethod,
              secret: e.secret,
            };
          },
          P = function () {
            var e = C(o);
            return (e.rpcId = r.generateUniqueId()), T(e), e;
          };
        return {
          isBrowserSupportStorage: function () {
            return d;
          },
          isBrowserSupportApplicationCache: function () {
            return u;
          },
          isBrowserSupportDarkMode: function () {
            return p;
          },
          getBrowserFeatures: function () {
            return a;
          },
          getAllOptions: function () {
            var e = angular.extend({}, o, w());
            if (
              (e.secret && (e.secret = r.base64Decode(e.secret)),
              angular.isArray(e.extendRpcServers))
            )
              for (var t = 0; t < e.extendRpcServers.length; t++) {
                var a = e.extendRpcServers[t];
                a.secret && (a.secret = r.base64Decode(a.secret));
              }
            return e;
          },
          getAllRpcSettings: function () {
            var e = [],
              t = this.getAllOptions(),
              a = C(t);
            if (
              ((a.isDefault = !0),
              e.push(a),
              angular.isArray(t.extendRpcServers))
            )
              for (var n = 0; n < t.extendRpcServers.length; n++) {
                var i = C(t.extendRpcServers[n]);
                (i.rpcId = t.extendRpcServers[n].rpcId),
                  (i.isDefault = !1),
                  e.push(i);
              }
            var s = this.getRPCListDisplayOrder();
            return (
              'recentlyUsed' === s ||
                ('rpcAlias' === s &&
                  e.sort(function (e, t) {
                    return String.naturalCompare(e.rpcAlias, t.rpcAlias);
                  })),
              e
            );
          },
          importAllOptions: function (e) {
            var t = angular.copy(o);
            for (var a in e)
              e.hasOwnProperty(a) &&
                t.hasOwnProperty(a) &&
                (angular.isObject(e[a]) ||
                  angular.isArray(e[a]) ||
                  (t[a] = e[a]));
            if (angular.isArray(e.extendRpcServers))
              for (var n = 0; n < e.extendRpcServers.length; n++) {
                var i = e.extendRpcServers[n],
                  s = P();
                for (var a in i)
                  i.hasOwnProperty(a) &&
                    s.hasOwnProperty(a) &&
                    (angular.isObject(i[a]) ||
                      angular.isArray(i[a]) ||
                      (s[a] = i[a]));
                t.extendRpcServers.push(s);
              }
            k(t);
          },
          exportAllOptions: function () {
            return angular.extend({}, o, w());
          },
          getAllSessionOptions: function () {
            return angular.copy(h);
          },
          isInsecureProtocolDisabled: function () {
            return v();
          },
          getLanguage: function () {
            return S('language');
          },
          setLanguage: function (e) {
            return !!s[e] && (x('language', e), !0);
          },
          getTheme: function () {
            return S('theme');
          },
          setTheme: function (e) {
            return x('theme', e), !0;
          },
          isEnableDebugMode: function () {
            return h.debugMode;
          },
          setDebugMode: function (e) {
            (h.debugMode = e), l.setEnableDebugLog(e);
          },
          getTitle: function () {
            return S('title');
          },
          setTitle: function (e) {
            x('title', e);
          },
          getBrowserNotification: function () {
            return S('browserNotification');
          },
          setBrowserNotification: function (e) {
            x('browserNotification', e);
          },
          getTitleRefreshInterval: function () {
            return S('titleRefreshInterval');
          },
          setTitleRefreshInterval: function (e) {
            x('titleRefreshInterval', Math.max(parseInt(e), 0));
          },
          getGlobalStatRefreshInterval: function () {
            return S('globalStatRefreshInterval');
          },
          setGlobalStatRefreshInterval: function (e) {
            x('globalStatRefreshInterval', Math.max(parseInt(e), 0));
          },
          getDownloadTaskRefreshInterval: function () {
            return S('downloadTaskRefreshInterval');
          },
          setDownloadTaskRefreshInterval: function (e) {
            x('downloadTaskRefreshInterval', Math.max(parseInt(e), 0));
          },
          getSwipeGesture: function () {
            return S('swipeGesture');
          },
          setSwipeGesture: function (e) {
            x('swipeGesture', e);
          },
          getDragAndDropTasks: function () {
            return S('dragAndDropTasks');
          },
          setDragAndDropTasks: function (e) {
            x('dragAndDropTasks', e);
          },
          getRPCListDisplayOrder: function () {
            return S('rpcListDisplayOrder');
          },
          setRPCListDisplayOrder: function (e) {
            x('rpcListDisplayOrder', e);
          },
          getAfterCreatingNewTask: function () {
            return S('afterCreatingNewTask');
          },
          setAfterCreatingNewTask: function (e) {
            x('afterCreatingNewTask', e);
          },
          getRemoveOldTaskAfterRetrying: function () {
            return S('removeOldTaskAfterRetrying');
          },
          setRemoveOldTaskAfterRetrying: function (e) {
            x('removeOldTaskAfterRetrying', e);
          },
          getConfirmTaskRemoval: function () {
            return S('confirmTaskRemoval');
          },
          setConfirmTaskRemoval: function (e) {
            x('confirmTaskRemoval', e);
          },
          getIncludePrefixWhenCopyingFromTaskDetails: function () {
            return S('includePrefixWhenCopyingFromTaskDetails');
          },
          setIncludePrefixWhenCopyingFromTaskDetails: function (e) {
            x('includePrefixWhenCopyingFromTaskDetails', e);
          },
          getShowPiecesInfoInTaskDetailPage: function () {
            return S('showPiecesInfoInTaskDetailPage');
          },
          setShowPiecesInfoInTaskDetailPage: function (e) {
            x('showPiecesInfoInTaskDetailPage', e);
          },
          getAfterRetryingTask: function () {
            return S('afterRetryingTask');
          },
          setAfterRetryingTask: function (e) {
            x('afterRetryingTask', e);
          },
          getCurrentRpcDisplayName: function () {
            var e = w();
            return e.rpcAlias ? e.rpcAlias : e.rpcHost + ':' + e.rpcPort;
          },
          getCurrentRpcUrl: function () {
            var e = w();
            return (
              e.protocol +
              '://' +
              e.rpcHost +
              ':' +
              e.rpcPort +
              '/' +
              e.rpcInterface
            );
          },
          getCurrentRpcHttpMethod: function () {
            return S('httpMethod');
          },
          isCurrentRpcUseWebSocket: function (e) {
            e || (e = w().protocol);
            return 'ws' === e || 'wss' === e;
          },
          getCurrentRpcSecret: function () {
            var e = S('secret');
            return e ? r.base64Decode(e) : e;
          },
          addNewRpcSetting: function () {
            var e = w();
            angular.isArray(e.extendRpcServers) || (e.extendRpcServers = []);
            var t = P();
            return e.extendRpcServers.push(t), k(e), t;
          },
          updateRpcSetting: function (e, t) {
            if (!e) return e;
            var a = C(e);
            if (angular.isUndefined(a[t])) return e;
            var n = a[t];
            if (
              ('rpcPort' === t
                ? (n = Math.max(parseInt(n), 0))
                : 'secret' === t && n && (n = r.base64Encode(n)),
              e.isDefault)
            )
              return x(t, n), e;
            var i = w();
            if (!angular.isArray(i.extendRpcServers)) return e;
            for (var s = 0; s < i.extendRpcServers.length; s++)
              if (i.extendRpcServers[s].rpcId === e.rpcId) {
                i.extendRpcServers[s][t] = n;
                break;
              }
            return k(i), e;
          },
          removeRpcSetting: function (e) {
            var t = w();
            if (!angular.isArray(t.extendRpcServers)) return e;
            for (var a = 0; a < t.extendRpcServers.length; a++)
              if (t.extendRpcServers[a].rpcId === e.rpcId) {
                t.extendRpcServers.splice(a, 1);
                break;
              }
            return k(t), e;
          },
          setDefaultRpcSetting: function (e, t) {
            t = angular.extend({ keepCurrent: !0, forceSet: !1 }, t);
            var a = w(),
              n = C(a);
            (n.rpcId = r.generateUniqueId()),
              angular.isArray(a.extendRpcServers) || (a.extendRpcServers = []);
            for (var i = null, s = 0; s < a.extendRpcServers.length; s++)
              if (a.extendRpcServers[s].rpcId === e.rpcId) {
                (i = C(a.extendRpcServers[s])), a.extendRpcServers.splice(s, 1);
                break;
              }
            return (
              t.forceSet &&
                (i = C(e)).secret &&
                (i.secret = r.base64Encode(i.secret)),
              i &&
                (t.keepCurrent && a.extendRpcServers.splice(0, 0, n),
                (a = angular.extend(a, i))),
              k(a),
              e
            );
          },
          isRpcSettingEqualsDefault: function (e) {
            if (!e) return !1;
            var t = this.getAllOptions();
            return (
              t.rpcHost === e.rpcHost &&
              t.rpcPort === e.rpcPort &&
              t.rpcInterface === e.rpcInterface &&
              t.protocol === e.protocol &&
              t.httpMethod === e.httpMethod &&
              t.secret === e.secret
            );
          },
          getDisplayOrder: function () {
            var e = S('displayOrder');
            return e || (e = 'default:asc'), e;
          },
          setDisplayOrder: function (e) {
            x('displayOrder', e);
          },
          getFileListDisplayOrder: function () {
            var e = S('fileListDisplayOrder');
            return e || (e = 'default:asc'), e;
          },
          setFileListDisplayOrder: function (e) {
            x('fileListDisplayOrder', e);
          },
          getPeerListDisplayOrder: function () {
            var e = S('peerListDisplayOrder');
            return e || (e = 'default:asc'), e;
          },
          setPeerListDisplayOrder: function (e) {
            x('peerListDisplayOrder', e);
          },
          resetSettings: function () {
            c.clearAll();
          },
          onApplicationCacheUpdated: function (e) {
            e && g.push(e);
          },
          onFirstAccess: function (e) {
            e && f.push(e);
          },
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').factory('ariaNgMonitorService', [
      '$filter',
      'ariaNgConstants',
      'ariaNgCommonService',
      'ariaNgLocalizationService',
      function (o, t, l, r) {
        var a = {},
          c = {},
          n = 'global',
          d = function (e) {
            return e === n
              ? t.globalStatStorageCapacity
              : t.taskStatStorageCapacity;
          },
          u = function (e) {
            for (
              var t = {
                  legend: { show: !1 },
                  grid: { x: 50, y: 10, x2: 10, y2: 10 },
                  tooltip: {
                    show: !0,
                    formatter: function (e) {
                      if ('' === e[0].name)
                        return (
                          '<div>' + r.getLocalizedText('No Data') + '</div>'
                        );
                      var t = l.getLongTimeFromUnixTime(e[0].name),
                        a = o('readableVolume')(e[0].value) + '/s';
                      return (
                        '<div><i class="fa fa-clock-o"></i> ' +
                        t +
                        '</div><div><i class="icon-download fa fa-arrow-down"></i> ' +
                        (o('readableVolume')(e[1].value) + '/s') +
                        '</div><div><i class="icon-upload fa fa-arrow-up"></i> ' +
                        a +
                        '</div>'
                      );
                    },
                  },
                  xAxis: {
                    data: [],
                    type: 'category',
                    boundaryGap: !1,
                    axisLabel: { show: !1 },
                  },
                  yAxis: {
                    type: 'value',
                    axisLabel: {
                      formatter: function (e) {
                        return o('readableVolume')(e, 'auto');
                      },
                    },
                  },
                  series: [
                    {
                      type: 'line',
                      areaStyle: { normal: { opacity: 0.1 } },
                      smooth: !0,
                      symbolSize: 6,
                      showAllSymbol: !1,
                      data: [],
                    },
                    {
                      type: 'line',
                      areaStyle: { normal: { opacity: 0.1 } },
                      smooth: !0,
                      symbolSize: 6,
                      showAllSymbol: !1,
                      data: [],
                    },
                  ],
                },
                a = t.xAxis.data,
                n = t.series[0].data,
                i = t.series[1].data,
                s = 0;
              s < d(e);
              s++
            )
              a.push(''), n.push(''), i.push('');
            return (c[e] = t);
          },
          p = function (e) {
            return angular.isDefined(c[e]);
          };
        return {
          recordStat: function (e, t) {
            var a, n, i, s, o, r;
            p(e) || u(e),
              (t.time = l.getCurrentUnixTime()),
              (n = t),
              (i = c[(a = e)]),
              (s = i.xAxis.data),
              (o = i.series[0].data),
              (r = i.series[1].data),
              s.length >= d(a) && (s.shift(), o.shift(), r.shift()),
              s.push(n.time),
              o.push(n.uploadSpeed),
              r.push(n.downloadSpeed);
          },
          getStatsData: function (e) {
            return p(e) || u(e), c[e];
          },
          getEmptyStatsData: function (e) {
            return p(e) && delete c[e], this.getStatsData(e);
          },
          recordGlobalStat: function (e) {
            this.recordStat(n, e), (a = e);
          },
          getGlobalStatsData: function () {
            return this.getStatsData(n);
          },
          getCurrentGlobalStat: function () {
            return a;
          },
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').factory('ariaNgTitleService', [
      '$filter',
      'ariaNgConstants',
      'ariaNgLocalizationService',
      'ariaNgSettingService',
      function (d, f, m, h) {
        var u = function (e) {
            if (!e) return {};
            for (
              var t = e.substring(2, e.length - 1).split(':'),
                a = { oldValue: e },
                n = 1;
              n < t.length;
              n++
            ) {
              var i = t[n].split('=');
              1 === i.length
                ? (a[i[0]] = !0)
                : 2 === i.length && (a[i[0]] = i[1]);
            }
            return a;
          },
          v = function (e, t, a) {
            var n,
              i,
              s,
              o = new RegExp(
                '\\$\\{' + t + '(:[a-zA-Z0-9]+(=[a-zA-Z0-9]+)?)*\\}',
                'g'
              ),
              r = e.match(o);
            if (r && 0 < r.length)
              for (var l = 0; l < r.length; l++) {
                var c = u(r[l]);
                angular.extend(c, a),
                  (n = e),
                  (s = void 0),
                  (s = (i = c).value),
                  'volume' === i.type && (s = d('readableVolume')(s, i.scale)),
                  i.prefix && !i.noprefix && (s = i.prefix + s),
                  i.suffix && !i.nosuffix && (s += i.suffix),
                  (e = n.replace(i.oldValue, s));
              }
            return e;
          };
        return {
          getFinalTitle: function (e) {
            var t,
              a,
              n,
              i,
              s,
              o,
              r,
              l,
              c,
              d,
              u,
              p,
              g = h.getTitle();
            return (
              (e = angular.extend(
                {
                  downloadingCount: 0,
                  waitingCount: 0,
                  stoppedCount: 0,
                  downloadSpeed: 0,
                  uploadSpeed: 0,
                },
                e
              )),
              (t = g),
              (a = e.currentRPCAlias),
              (g = v(t, 'rpcprofile', { value: a })),
              (n = g),
              (i = e.downloadingCount),
              (g = v(n, 'downloading', {
                prefix: m.getLocalizedText('Downloading') + ': ',
                value: i,
              })),
              (s = g),
              (o = e.waitingCount),
              (g = v(s, 'waiting', {
                prefix: m.getLocalizedText('Waiting') + ': ',
                value: o,
              })),
              (r = g),
              (l = e.stoppedCount),
              (g = v(r, 'stopped', {
                prefix: m.getLocalizedText('Finished / Stopped') + ': ',
                value: l,
              })),
              (c = g),
              (d = e.downloadSpeed),
              (g = v(c, 'downspeed', {
                prefix: m.getLocalizedText('Download') + ': ',
                value: d,
                type: 'volume',
                suffix: '/s',
              })),
              (u = g),
              (p = e.uploadSpeed),
              (g = v(u, 'upspeed', {
                prefix: m.getLocalizedText('Upload') + ': ',
                value: p,
                type: 'volume',
                suffix: '/s',
              })),
              (g = v(g, 'title', { value: f.title }))
            );
          },
          getFinalTitleByGlobalStat: function (e) {
            var t = {
              currentRPCAlias:
                e && e.currentRpcProfile
                  ? e.currentRpcProfile.rpcAlias ||
                    e.currentRpcProfile.rpcHost +
                      ':' +
                      e.currentRpcProfile.rpcPort
                  : '',
              downloadingCount: e && e.globalStat ? e.globalStat.numActive : 0,
              waitingCount: e && e.globalStat ? e.globalStat.numWaiting : 0,
              stoppedCount: e && e.globalStat ? e.globalStat.numStopped : 0,
              downloadSpeed: e && e.globalStat ? e.globalStat.downloadSpeed : 0,
              uploadSpeed: e && e.globalStat ? e.globalStat.uploadSpeed : 0,
            };
            return this.getFinalTitle(t);
          },
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').factory('aria2HttpRpcService', [
      '$http',
      'ariaNgCommonService',
      'ariaNgSettingService',
      'ariaNgLogService',
      function (t, s, e, n) {
        var i = e.getCurrentRpcUrl(),
          o = e.getCurrentRpcHttpMethod();
        return {
          request: function (a) {
            if (a) {
              var e = { url: i, method: o };
              return (
                'POST' === e.method
                  ? (e.data = a.requestBody)
                  : 'GET' === e.method &&
                    (e.url = (function (e, t) {
                      if (!e || e.length < 1) return e;
                      var a = '';
                      for (var n in t)
                        if (t.hasOwnProperty(n)) {
                          var i = t[n];
                          null === i ||
                            angular.isUndefined(i) ||
                            (0 < a.length && (a += '&'),
                            (angular.isObject(i) || angular.isArray(i)) &&
                              ((i = angular.toJson(i)),
                              (i = s.base64Encode(i)),
                              (i = encodeURIComponent(i))),
                            (a += n + '=' + i));
                        }
                      return a.length < 1
                        ? e
                        : ((a = e.indexOf('?') < 0 ? '?' + a : '&' + a), e + a);
                    })(e.url, a.requestBody)),
                n.debug(
                  '[aria2HttpRpcService.request] ' +
                    (a && a.requestBody && a.requestBody.method
                      ? a.requestBody.method + ' '
                      : '') +
                    'request start',
                  e
                ),
                t(e)
                  .then(function (e) {
                    var t = e.data;
                    n.debug(
                      '[aria2HttpRpcService.request] ' +
                        (a && a.requestBody && a.requestBody.method
                          ? a.requestBody.method + ' '
                          : '') +
                        'response success',
                      e
                    ),
                      t &&
                        (a.connectionSuccessCallback &&
                          a.connectionSuccessCallback({ rpcUrl: i, method: o }),
                        a.successCallback && a.successCallback(t.id, t.result));
                  })
                  .catch(function (e) {
                    var t = e.data;
                    n.debug(
                      '[aria2HttpRpcService.request] ' +
                        (a && a.requestBody && a.requestBody.method
                          ? a.requestBody.method + ' '
                          : '') +
                        'response error',
                      e
                    ),
                      t ||
                        ((t = { id: '-1', error: { innerError: !0 } }),
                        a.connectionFailedCallback &&
                          a.connectionFailedCallback({ rpcUrl: i, method: o })),
                      a.errorCallback && a.errorCallback(t.id, t.error);
                  })
              );
            }
          },
          on: function (e, t) {},
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').factory('aria2WebSocketRpcService', [
      '$q',
      '$websocket',
      'ariaNgConstants',
      'ariaNgSettingService',
      'ariaNgLogService',
      function (s, e, a, t, o) {
        var i = t.getCurrentRpcUrl(),
          n = null,
          r = {},
          l = {},
          c = function (t) {
            if (null === n)
              try {
                (n = e(i, {
                  reconnectIfNotNormalClose: a.websocketAutoReconnect,
                })).onMessage(function (e) {
                  if (e && e.data) {
                    var t = angular.fromJson(e.data);
                    t &&
                      (t.id
                        ? (function (e) {
                            var t = e.id;
                            if (t) {
                              var a = r[t];
                              if (a) {
                                var n = a.context;
                                a.deferred.resolve({ success: !0, context: n }),
                                  e.result &&
                                    n.connectionSuccessCallback &&
                                    n.connectionSuccessCallback({ rpcUrl: i }),
                                  e.result &&
                                    n.successCallback &&
                                    (o.debug(
                                      '[aria2WebSocketRpcService.request] ' +
                                        (n &&
                                        n.requestBody &&
                                        n.requestBody.method
                                          ? n.requestBody.method + ' '
                                          : '') +
                                        'response success',
                                      e
                                    ),
                                    n.successCallback(n.id, e.result)),
                                  e.error &&
                                    n.errorCallback &&
                                    (o.debug(
                                      '[aria2WebSocketRpcService.request] ' +
                                        (n &&
                                        n.requestBody &&
                                        n.requestBody.method
                                          ? n.requestBody.method + ' '
                                          : '') +
                                        'response error',
                                      e
                                    ),
                                    n.errorCallback(n.id, e.error)),
                                  delete r[t];
                              }
                            }
                          })(t)
                        : t.method &&
                          (function (e) {
                            var t = e.method;
                            if (t) {
                              var a = l[t];
                              if (angular.isArray(a) && !(a.length < 1))
                                for (var n = 0; n < a.length; n++)
                                  (0, a[n])(
                                    angular.isArray(e.params) &&
                                      0 < e.params.length
                                      ? e.params[0]
                                      : null
                                  );
                            }
                          })(t));
                  }
                }),
                  n.onOpen(function (e) {
                    o.debug(
                      '[aria2WebSocketRpcService.onOpen] websocket is opened',
                      e
                    ),
                      t &&
                        t.connectionSuccessCallback &&
                        t.connectionSuccessCallback({ rpcUrl: i });
                  }),
                  n.onClose(function (e) {
                    o.warn(
                      '[aria2WebSocketRpcService.onClose] websocket is closed',
                      e
                    ),
                      t &&
                        t.connectionFailedCallback &&
                        t.connectionFailedCallback({ rpcUrl: i });
                  });
              } catch (e) {
                return {
                  success: !1,
                  error: 'Cannot initialize WebSocket!',
                  exception: e,
                };
              }
            return { success: !0, instance: n };
          };
        return {
          request: function (e) {
            if (e) {
              var t = c({
                  connectionFailedCallback: e.connectionFailedCallback,
                }),
                a = e.uniqueId,
                n = angular.toJson(e.requestBody);
              o.debug(
                '[aria2WebSocketRpcService.request] ' +
                  (e && e.requestBody && e.requestBody.method
                    ? e.requestBody.method + ' '
                    : '') +
                  'request start',
                e
              );
              var i = s.defer();
              return (
                (r[a] = { context: e, deferred: i }),
                t.instance
                  ? t.instance.send(n)
                  : (i.reject({ success: !1, context: e }),
                    o.debug(
                      '[aria2WebSocketRpcService.request] client error',
                      t
                    ),
                    e.errorCallback(e.id, { message: t.error })),
                i.promise
              );
            }
          },
          on: function (e, t) {
            var a = l[e];
            angular.isArray(a) || (a = l[e] = []), a.push(t);
          },
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').factory('aria2RpcService', [
      '$q',
      'aria2RpcConstants',
      'aria2RpcErrors',
      'aria2AllOptions',
      'ariaNgCommonService',
      'ariaNgLocalizationService',
      'ariaNgLogService',
      'ariaNgSettingService',
      'aria2HttpRpcService',
      'aria2WebSocketRpcService',
      function (l, o, r, i, s, c, d, u, e, t) {
        var p = u.isCurrentRpcUseWebSocket() ? t : e,
          g = !1,
          f = u.getCurrentRpcSecret(),
          m = [],
          h = [],
          v = [],
          b = [],
          y = [],
          a = [],
          n = [],
          k = [],
          w = [],
          S = [],
          x = [],
          T = function (e) {
            return o.rpcServiceName + '.' + e;
          },
          C = function (e, t) {
            if (t) return e;
            var a = s.generateUniqueId(),
              n = {
                uniqueId: a,
                requestBody: {
                  jsonrpc: o.rpcServiceVersion,
                  method: e.methodName,
                  id: a,
                  params: e.params,
                },
                connectionSuccessCallback: e.connectionSuccessCallback,
                connectionFailedCallback: e.connectionFailedCallback,
                successCallback: e.successCallback,
                errorCallback: e.errorCallback,
              };
            return p.request(n);
          },
          P = function (e, a) {
            var t = T(e);
            p.on(t, function (e) {
              if (angular.isArray(a) && !(a.length < 1))
                for (var t = 0; t < a.length; t++) {
                  (0, a[t])(e);
                }
            });
          },
          D = function (e, t) {
            if (angular.isArray(e) && !(e.length < 1))
              for (var a = 0; a < e.length; a++) {
                (0, e[a])(t);
              }
          },
          A = function (e, t, a) {
            for (var n = [], i = !1, s = !1, o = [], r = 0; r < t.length; r++)
              (t[r].callback = function (e) {
                o.push(e), (i = i || e.success), (s = s || !e.success);
              }),
                n.push(e(t[r]));
            return l.all(n).finally(function () {
              a && a({ hasSuccess: !!i, hasError: !!s, results: o });
            });
          },
          O = function () {
            var e = arguments[0],
              t = 0 === e.indexOf(o.rpcSystemServiceName + '.'),
              a = [],
              n = {
                methodName: t ? e : T(e),
                connectionSuccessCallback: function () {
                  D(b);
                },
                connectionFailedCallback: function () {
                  D(y);
                },
              };
            if (
              (f && !t && a.push(o.rpcTokenPrefix + f), 1 < arguments.length)
            ) {
              var i = arguments[1];
              (n.successCallback = function (e, t) {
                if (
                  (i.callback &&
                    i.callback({ id: e, success: !0, data: t, context: i }),
                  D(h),
                  !g)
                ) {
                  g = !0;
                  var a = { rpcName: u.getCurrentRpcDisplayName() };
                  D(m, a);
                }
              }),
                (n.errorCallback = function (e, t) {
                  var a,
                    n = !1;
                  i.silent ||
                    (n = !(
                      !(a = t) ||
                      !a.message ||
                      (d.error(
                        '[aria2RpcService.processError] ' + a.message,
                        a
                      ),
                      r[a.message] && r[a.message].tipTextKey
                        ? c.showError(r[a.message].tipTextKey)
                        : c.showError(a.message),
                      0)
                    )),
                    i.callback &&
                      i.callback({
                        id: e,
                        success: !1,
                        data: t,
                        errorProcessed: n,
                        context: i,
                      }),
                    D(v);
                });
            }
            if (2 < arguments.length)
              for (var s = 2; s < arguments.length; s++)
                null !== arguments[s] &&
                  angular.isDefined(arguments[s]) &&
                  a.push(arguments[s]);
            return 0 < a.length && (n.params = a), n;
          },
          R = function (e, t) {
            var a = angular.copy(e);
            for (var n in a)
              a.hasOwnProperty(n) && N(a, n) && (a[n] = I(a[n], i[n]));
            return t && t.pauseOnAdded && (a.pause = 'true'), a;
          },
          N = function (e, t) {
            return (
              !(!e[t] || !angular.isString(e[t])) &&
              !(!i[t] || 'array' !== i[t].submitFormat)
            );
          },
          I = function (e, t) {
            for (var a = e.split(t.split), n = [], i = 0; i < a.length; i++) {
              var s = a[i];
              s && ((s = s.replace('\r', '')), n.push(s));
            }
            return n;
          };
        return (
          P('onDownloadStart', a),
          P('onDownloadPause', n),
          P('onDownloadStop', k),
          P('onDownloadComplete', w),
          P('onDownloadError', S),
          P('onBtDownloadComplete', x),
          {
            getBasicTaskParams: function () {
              return [
                'gid',
                'totalLength',
                'completedLength',
                'uploadSpeed',
                'downloadSpeed',
                'connections',
                'numSeeders',
                'seeder',
                'status',
                'errorCode',
                'verifiedLength',
                'verifyIntegrityPending',
              ];
            },
            getFullTaskParams: function () {
              var e = this.getBasicTaskParams();
              return (
                e.push('files'), e.push('bittorrent'), e.push('infoHash'), e
              );
            },
            addUri: function (e, t) {
              var a = e.task.urls,
                n = R(e.task.options, e);
              return C(O('addUri', e, a, n), !!t);
            },
            addUriMulti: function (e) {
              for (var t = [], a = 0; a < e.tasks.length; a++) {
                var n = e.tasks[a];
                t.push({
                  silent: !!e.silent,
                  task: n,
                  pauseOnAdded: e.pauseOnAdded,
                });
              }
              return A(this.addUri, t, e.callback);
            },
            addTorrent: function (e, t) {
              var a = e.task.content,
                n = R(e.task.options, e);
              return C(O('addTorrent', e, a, [], n), !!t);
            },
            addMetalink: function (e, t) {
              var a = e.task.content,
                n = R(e.task.options, e);
              return C(O('addMetalink', e, a, n), !!t);
            },
            remove: function (e, t) {
              return C(O('remove', e, e.gid), !!t);
            },
            forceRemove: function (e, t) {
              return C(O('forceRemove', e, e.gid), !!t);
            },
            forceRemoveMulti: function (e) {
              for (var t = [], a = 0; a < e.gids.length; a++)
                t.push({ silent: !!e.silent, gid: e.gids[a] });
              return A(this.forceRemove, t, e.callback);
            },
            pause: function (e, t) {
              return C(O('pause', e, e.gid), !!t);
            },
            pauseAll: function (e, t) {
              return C(O('pauseAll', e), !!t);
            },
            forcePause: function (e, t) {
              return C(O('forcePause', e, e.gid), !!t);
            },
            forcePauseMulti: function (e) {
              for (var t = [], a = 0; a < e.gids.length; a++)
                t.push({ silent: !!e.silent, gid: e.gids[a] });
              return A(this.forcePause, t, e.callback);
            },
            forcePauseAll: function (e, t) {
              return C(O('forcePauseAll', e), !!t);
            },
            unpause: function (e, t) {
              return C(O('unpause', e, e.gid), !!t);
            },
            unpauseMulti: function (e) {
              for (var t = [], a = 0; a < e.gids.length; a++)
                t.push({ silent: !!e.silent, gid: e.gids[a] });
              return A(this.unpause, t, e.callback);
            },
            unpauseAll: function (e, t) {
              return C(O('unpauseAll', e), !!t);
            },
            tellStatus: function (e, t) {
              return C(O('tellStatus', e, e.gid), !!t);
            },
            getUris: function (e, t) {
              return C(O('getUris', e, e.gid), !!t);
            },
            getFiles: function (e, t) {
              return C(O('getFiles', e, e.gid), !!t);
            },
            getPeers: function (e, t) {
              return C(O('getPeers', e, e.gid), !!t);
            },
            getServers: function (e, t) {
              return C(O('getServers', e, e.gid), !!t);
            },
            tellActive: function (e, t) {
              return C(
                O(
                  'tellActive',
                  e,
                  angular.isDefined(e.requestParams) ? e.requestParams : null
                ),
                !!t
              );
            },
            tellWaiting: function (e, t) {
              return C(
                O(
                  'tellWaiting',
                  e,
                  angular.isDefined(e.offset) ? e.offset : 0,
                  angular.isDefined(e.num) ? e.num : 1e3,
                  angular.isDefined(e.requestParams) ? e.requestParams : null
                ),
                !!t
              );
            },
            tellStopped: function (e, t) {
              return C(
                O(
                  'tellStopped',
                  e,
                  angular.isDefined(e.offset) ? e.offset : -1,
                  angular.isDefined(e.num) ? e.num : 1e3,
                  angular.isDefined(e.requestParams) ? e.requestParams : null
                ),
                !!t
              );
            },
            changePosition: function (e, t) {
              return C(O('changePosition', e, e.gid, e.pos, e.how), !!t);
            },
            changeUri: function (e, t) {
              return C(
                O('changeUri', e, e.gid, e.fileIndex, e.delUris, e.addUris),
                !!t
              );
            },
            getOption: function (e, t) {
              return C(O('getOption', e, e.gid), !!t);
            },
            changeOption: function (e, t) {
              var a = R(e.options, e);
              return C(O('changeOption', e, e.gid, a), !!t);
            },
            getGlobalOption: function (e, t) {
              return C(O('getGlobalOption', e), !!t);
            },
            changeGlobalOption: function (e, t) {
              var a = R(e.options, e);
              return C(O('changeGlobalOption', e, a), !!t);
            },
            getGlobalStat: function (e, t) {
              return C(O('getGlobalStat', e), !!t);
            },
            purgeDownloadResult: function (e, t) {
              return C(O('purgeDownloadResult', e), !!t);
            },
            removeDownloadResult: function (e, t) {
              return C(O('removeDownloadResult', e, e.gid), !!t);
            },
            removeDownloadResultMulti: function (e) {
              for (var t = [], a = 0; a < e.gids.length; a++)
                t.push({ silent: !!e.silent, gid: e.gids[a] });
              return A(this.removeDownloadResult, t, e.callback);
            },
            getVersion: function (e, t) {
              return C(O('getVersion', e), !!t);
            },
            getSessionInfo: function (e, t) {
              return C(O('getSessionInfo', e), !!t);
            },
            shutdown: function (e, t) {
              return C(O('shutdown', e), !!t);
            },
            forceShutdown: function (e, t) {
              return C(O('forceShutdown', e), !!t);
            },
            saveSession: function (e, t) {
              return C(O('saveSession', e), !!t);
            },
            multicall: function (e) {
              return C(O('system.multicall', e, e.methods));
            },
            listMethods: function (e) {
              return C(O('system.listMethods', e));
            },
            onFirstSuccess: function (e) {
              m.push(e.callback);
            },
            onOperationSuccess: function (e) {
              h.push(e.callback);
            },
            onOperationError: function (e) {
              v.push(e.callback);
            },
            onConnectionSuccess: function (e) {
              b.push(e.callback);
            },
            onConnectionFailed: function (e) {
              y.push(e.callback);
            },
            onDownloadStart: function (e) {
              a.push(e.callback);
            },
            onDownloadPause: function (e) {
              n.push(e.callback);
            },
            onDownloadStop: function (e) {
              k.push(e.callback);
            },
            onDownloadComplete: function (e) {
              w.push(e.callback);
            },
            onDownloadError: function (e) {
              S.push(e.callback);
            },
            onBtDownloadComplete: function (e) {
              x.push(e.callback);
            },
          }
        );
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').factory('aria2TaskService', [
      '$q',
      'bittorrentPeeridService',
      'ariaNgConstants',
      'aria2Errors',
      'aria2RpcService',
      'ariaNgCommonService',
      'ariaNgLocalizationService',
      'ariaNgLogService',
      'ariaNgSettingService',
      function (u, m, l, y, p, k, w, S, g) {
        var x = function (e) {
            if (!e)
              return S.warn('[aria2TaskService.getFileName] file is null'), '';
            var t = e.path,
              a = !1;
            !t &&
              e.uris &&
              0 < e.uris.length &&
              ((t = e.uris[0].uri), (a = !0));
            var n = t.lastIndexOf('/');
            if (n <= 0 || n === t.length) return t;
            var i = t.substring(n + 1),
              s = i.indexOf('?'),
              o = i;
            if ((0 < s && (o = i.substring(0, s)), a))
              try {
                o = decodeURI(o);
              } catch (e) {
                S.warn(
                  '[aria2TaskService.getFileName] failed to url decode file name, original file name: ' +
                    o,
                  e
                );
              }
            return o;
          },
          T = function (e, t) {
            var a = e.dir,
              n = t.path;
            a && (a = a.replace(/\\/g, l.defaultPathSeparator)),
              n && (n = n.replace(/\\/g, l.defaultPathSeparator));
            var i = function () {
              1 < n.length &&
                n.charAt(0) === l.defaultPathSeparator &&
                (n = n.substr(1));
            };
            if (
              (a && 0 === n.indexOf(a) && (n = n.substr(a.length)),
              i(),
              e.bittorrent &&
                'multi' === e.bittorrent.mode &&
                e.bittorrent.info &&
                e.bittorrent.info.name)
            ) {
              var s = e.bittorrent.info.name;
              0 === n.indexOf(s) && (n = n.substr(s.length));
            }
            return (
              i(),
              t.fileName &&
                n.lastIndexOf(t.fileName) + t.fileName.length === n.length &&
                (n = n.substr(0, n.length - t.fileName.length)),
              1 < n.length &&
                n.charAt(n.length - 1) === l.defaultPathSeparator &&
                (n = n.substr(0, n.length - 1)),
              n
            );
          },
          c = function (e, t, a) {
            var n = a[e];
            if (n) return n;
            var i = null,
              s = e;
            if (e.length) {
              var o = '',
                r = e.lastIndexOf(l.defaultPathSeparator);
              0 < r && ((o = e.substring(0, r)), (s = e.substring(r + 1))),
                (i = c(o, t, a));
            }
            return (
              (n = {
                isDir: !0,
                nodePath: e,
                nodeName: s,
                relativePath: (i && i.nodePath) || '',
                level: (i && i.level + 1) || 0,
                length: 0,
                selected: !0,
                partialSelected: !1,
                files: [],
                subDirs: [],
              }),
              t.push(n),
              (a[e] = n),
              i && i.subDirs.push(n),
              n
            );
          },
          C = function (e, t, a) {
            if (e && t && a) {
              var n = e.relativePath || '',
                i = c(n, t, a);
              return i.files.push(e), i;
            }
          },
          P = function (e, t, a) {
            if (e) {
              var n = 0,
                i = 0,
                s = 0;
              if (e.subDirs && e.subDirs.length)
                for (var o = 0; o < e.subDirs.length; o++) {
                  var r = e.subDirs[o];
                  a.push(r),
                    P(r, t, a),
                    (n += r.length),
                    (i += r.selected ? 1 : 0),
                    (s += r.partialSelected ? 1 : 0);
                }
              if (e.files && e.files.length)
                for (o = 0; o < e.files.length; o++) {
                  var l = e.files[o];
                  a.push(l), (n += l.length), (i += l.selected ? 1 : 0);
                }
              (e.length = n),
                (e.selected = 0 < i && i === e.subDirs.length + e.files.length),
                (e.partialSelected =
                  (0 < i && i < e.subDirs.length + e.files.length) || 0 < s);
            }
          },
          D = function (e, t) {
            for (var a = [], n = 0; n < t; n++) a.push(!1);
            if (!e) return a;
            var i = 0;
            for (n = 0; n < e.length; n++)
              for (var s = parseInt(e[n], 16), o = 1; o <= 4; o++) {
                var r = 1 << (4 - o),
                  l = (s & r) === r;
                if (((a[i++] = l), t <= i)) return a;
              }
            return a;
          },
          r = function (e, t) {
            if (!e)
              return (
                S.warn('[aria2TaskService.processDownloadTask] task is null'), e
              );
            t = t && e.bittorrent && 'multi' === e.bittorrent.mode;
            var a,
              n,
              i = D(e.bitfield, e.numPieces);
            (e.totalLength = parseInt(e.totalLength)),
              (e.completedLength = parseInt(e.completedLength)),
              (e.completePercent =
                0 < e.totalLength
                  ? (e.completedLength / e.totalLength) * 100
                  : 0),
              (e.remainLength = e.totalLength - e.completedLength),
              (e.remainPercent = 100 - e.completePercent),
              (e.uploadLength = e.uploadLength ? parseInt(e.uploadLength) : 0),
              (e.shareRatio =
                0 < e.completedLength ? e.uploadLength / e.completedLength : 0),
              (e.uploadSpeed = parseInt(e.uploadSpeed)),
              (e.downloadSpeed = parseInt(e.downloadSpeed)),
              (e.numPieces = parseInt(e.numPieces)),
              (e.completedPieces = k.countArray(i, !0)),
              (e.pieceLength = parseInt(e.pieceLength)),
              (e.idle = 0 === e.downloadSpeed),
              (e.remainTime =
                ((a = e.remainLength),
                0 === (n = e.downloadSpeed) ? 0 : a / n)),
              (e.seeder = !0 === e.seeder || 'true' === e.seeder),
              e.verifiedLength && e.totalLength
                ? (e.verifiedPercent = parseInt(
                    (e.verifiedLength / e.totalLength) * 100
                  ))
                : (e.verifiedPercent = void 0);
            var s,
              o,
              r,
              l,
              c =
                ((r = !(o = '')),
                (s = e).bittorrent &&
                  s.bittorrent.info &&
                  (o = s.bittorrent.info.name),
                !o && s.files && 0 < s.files.length && (o = x(s.files[0])),
                o || ((o = w.getLocalizedText('Unknown')), (r = !1)),
                { name: o, success: r });
            if (
              ((e.taskName = c.name),
              (e.hasTaskName = c.success),
              (e.errorDescription =
                (l = e).errorCode &&
                y[l.errorCode] &&
                y[l.errorCode].descriptionKey
                  ? y[l.errorCode].hide
                    ? ''
                    : y[l.errorCode].descriptionKey
                  : ''),
              e.files)
            ) {
              for (var d = 0, u = [], p = {}, g = 0; g < e.files.length; g++) {
                var f = e.files[g];
                if (
                  ((f.index = parseInt(f.index)),
                  (f.fileName = x(f)),
                  (f.length = parseInt(f.length)),
                  (f.selected = !0 === f.selected || 'true' === f.selected),
                  (f.completedLength = parseInt(f.completedLength)),
                  (f.completePercent =
                    0 < f.length ? (f.completedLength / f.length) * 100 : 0),
                  t)
                ) {
                  f.relativePath = T(e, f);
                  var m = C(f, u, p);
                  f.level = m.level + 1;
                }
                d += f.selected ? 1 : 0;
              }
              if (t && 1 < u.length) {
                var h = [];
                P(p[''], p, h), (e.files = h), (e.multiDir = !0);
              }
              e.selectedFileCount = d;
            }
            if (
              e.files &&
              1 === e.files.length &&
              e.files[0].uris &&
              e.files[0].uris[0]
            ) {
              var v = !0,
                b = e.files[0].uris[0].uri;
              for (g = 0; g < e.files[0].uris.length; g++) {
                if (e.files[0].uris[g].uri !== b) {
                  v = !1;
                  break;
                }
              }
              v && (e.singleUrl = b);
            }
            return (
              S.debug(
                '[aria2TaskService.processDownloadTask] process success',
                e
              ),
              e
            );
          },
          d = function (e, t, a) {
            if (!e)
              return (
                S.warn('[aria2TaskService.processBtPeers] peers is null'), e
              );
            for (
              var n = D(t.bitfield, t.numPieces),
                i = k.countArray(n, !0),
                s = t.completePercent,
                o = 0;
              o < e.length;
              o++
            ) {
              var r = e[o],
                l = parseInt(r.uploadSpeed),
                c = parseInt(r.downloadSpeed),
                d = D(r.bitfield, t.numPieces),
                u = k.countArray(d, !0);
              if (
                ((r.name = r.ip + ':' + r.port),
                (r.completePercent = (u / t.numPieces) * 100),
                (r.downloadSpeed = l),
                (r.uploadSpeed = c),
                (r.seeder = !0 === r.seeder || 'true' === r.seeder),
                u === i && r.completePercent !== s && (r.completePercent = s),
                r.peerId)
              ) {
                var p = k.decodePercentEncodedString(r.peerId),
                  g = p ? m.parseClient(p) : null;
                if (g && 'unknown' !== g.client) {
                  var f = {
                    name: g.client ? g.client.trim() : '',
                    version: g.version ? g.version.trim() : '',
                  };
                  (f.info = f.name + (f.version ? ' ' + f.version : '')),
                    (r.client = f);
                }
              }
            }
            return a && e.push(h(t)), e;
          },
          t = function (a, n, i) {
            return function (e) {
              var t = { type: i, task: null };
              e && e.gid
                ? a(
                    e.gid,
                    function (e) {
                      (t.task = e.success ? e.data : null), n(t);
                    },
                    !0
                  )
                : n(t);
            };
          },
          h = function (e) {
            return {
              local: !0,
              bitfield: e.bitfield,
              completePercent: e.completePercent,
              downloadSpeed: e.downloadSpeed,
              name: '(local)',
              seeder: e.seeder,
              uploadSpeed: e.uploadSpeed,
            };
          };
        return {
          getTaskList: function (e, t, a, n) {
            var i = null;
            if ('downloading' === e) i = p.tellActive;
            else if ('waiting' === e) i = p.tellWaiting;
            else {
              if ('stopped' !== e) return;
              i = p.tellStopped;
            }
            return i({
              requestWholeInfo: t,
              requestParams: t ? p.getFullTaskParams() : p.getBasicTaskParams(),
              silent: !!n,
              callback: function (e) {
                a
                  ? a(e)
                  : S.warn('[aria2TaskService.getTaskList] callback is null');
              },
            });
          },
          getTaskStatus: function (e, t, a, n) {
            return p.tellStatus({
              gid: e,
              silent: !!a,
              callback: function (e) {
                t
                  ? (e.success && r(e.data, n), t(e))
                  : S.warn('[aria2TaskService.getTaskStatus] callback is null');
              },
            });
          },
          getTaskOptions: function (e, t, a) {
            return p.getOption({ gid: e, silent: !!a, callback: t });
          },
          setTaskOption: function (e, t, a, n, i) {
            var s = {};
            return (
              (s[t] = a),
              p.changeOption({ gid: e, options: s, silent: !!i, callback: n })
            );
          },
          selectTaskFile: function (e, t, a, n) {
            for (var i = '', s = 0; s < t.length; s++)
              0 < i.length && (i += ','), (i += t[s]);
            return this.setTaskOption(e, 'select-file', i, a, n);
          },
          getBtTaskPeers: function (t, a, e, n) {
            return p.getPeers({
              gid: t.gid,
              silent: !!e,
              callback: function (e) {
                a
                  ? (e.success && d(e.data, t, n), a(e))
                  : S.warn(
                      '[aria2TaskService.getBtTaskPeers] callback is null'
                    );
              },
            });
          },
          getTaskStatusAndBtPeers: function (e, t, a, n, i, s) {
            var o = [p.tellStatus({ gid: e }, !0)];
            return (
              n && o.push(p.getPeers({ gid: e }, !0)),
              p.multicall({
                methods: o,
                silent: !!a,
                callback: function (e) {
                  t
                    ? ((e.task = {}),
                      e.success &&
                        0 < e.data.length &&
                        ((e.task = e.data[0][0]), r(e.task, s)),
                      e.success &&
                        e.task.bittorrent &&
                        1 < e.data.length &&
                        ((e.peers = e.data[1][0]), d(e.peers, e.task, i)),
                      t(e))
                    : S.warn(
                        '[aria2TaskService.getTaskStatusAndBtPeers] callback is null'
                      );
                },
              })
            );
          },
          newUriTask: function (e, t, a, n) {
            return p.addUri({
              task: e,
              pauseOnAdded: !!t,
              silent: !!n,
              callback: a,
            });
          },
          newUriTasks: function (e, t, a, n) {
            return p.addUriMulti({
              tasks: e,
              pauseOnAdded: !!t,
              silent: !!n,
              callback: a,
            });
          },
          newTorrentTask: function (e, t, a, n) {
            return p.addTorrent({
              task: e,
              pauseOnAdded: !!t,
              silent: !!n,
              callback: a,
            });
          },
          newMetalinkTask: function (e, t, a, n) {
            return p.addMetalink({
              task: e,
              pauseOnAdded: !!t,
              silent: !!n,
              callback: a,
            });
          },
          startTasks: function (e, t, a) {
            return p.unpauseMulti({ gids: e, silent: !!a, callback: t });
          },
          pauseTasks: function (e, t, a) {
            return p.forcePauseMulti({ gids: e, silent: !!a, callback: t });
          },
          retryTask: function (s, o, r) {
            var l = u.defer(),
              e = [p.tellStatus({ gid: s }, !0), p.getOption({ gid: s }, !0)],
              c = null,
              d = null;
            return (
              p.multicall({
                methods: e,
                silent: !!r,
                callback: function (e) {
                  if (o) {
                    if (!e.success)
                      return (
                        S.warn(
                          '[aria2TaskService.retryTask] response is not success',
                          e
                        ),
                        l.reject(e),
                        void o(e)
                      );
                    if (
                      (0 < e.data.length && (c = e.data[0][0]),
                      1 < e.data.length && (d = e.data[1][0]),
                      !c ||
                        !d ||
                        !c.files ||
                        1 !== c.files.length ||
                        c.bittorrent)
                    )
                      return (
                        c ||
                          S.warn('[aria2TaskService.retryTask] task is null'),
                        d ||
                          S.warn(
                            '[aria2TaskService.retryTask] options is null'
                          ),
                        c.files ||
                          S.warn(
                            '[aria2TaskService.retryTask] task file is null'
                          ),
                        1 !== c.files.length &&
                          S.warn(
                            '[aria2TaskService.retryTask] task file length is not equal 1'
                          ),
                        c.bittorrent &&
                          S.warn(
                            '[aria2TaskService.retryTask] task is bittorrent'
                          ),
                        l.reject(s),
                        void o({ success: !1 })
                      );
                    for (
                      var t = c.files[0], a = [], n = 0;
                      n < t.uris.length;
                      n++
                    ) {
                      var i = t.uris[n];
                      a.push(i.uri);
                    }
                    p.addUri({
                      task: { urls: a, options: d },
                      pauseOnAdded: !1,
                      silent: !!r,
                      callback: function (e) {
                        if (!e.success)
                          return (
                            S.warn(
                              '[aria2TaskService.retryTask] addUri response is not success',
                              e
                            ),
                            l.reject(e),
                            void o(e)
                          );
                        g.getRemoveOldTaskAfterRetrying() &&
                          p.removeDownloadResult({
                            gid: s,
                            silent: !0,
                            callback: function (e) {
                              e.success ||
                                S.warn(
                                  '[aria2TaskService.retryTask] removeDownloadResult response is not success',
                                  e
                                );
                            },
                          }),
                          l.resolve(e),
                          o(e);
                      },
                    });
                  } else
                    S.warn('[aria2TaskService.retryTask] callback is null');
                },
              }),
              l.promise
            );
          },
          retryTasks: function (i, s, e) {
            if (s) {
              for (
                var t = this.retryTask,
                  o = u.defer(),
                  a = null,
                  r = 0,
                  l = 0,
                  n = function (a, n) {
                    return (
                      S.debug(
                        '[aria2TaskService.retryTasks] task#' +
                          n +
                          ', gid=' +
                          a.gid +
                          ' start retrying',
                        a
                      ),
                      t(
                        a.gid,
                        function (e) {
                          if (
                            (S.debug(
                              '[aria2TaskService.retryTasks] task#' +
                                n +
                                ', gid=' +
                                a.gid +
                                ', result=' +
                                e.success,
                              a
                            ),
                            e.success ? r++ : l++,
                            r + l === i.length)
                          ) {
                            var t = {
                              successCount: r,
                              failedCount: l,
                              hasSuccess: 0 < r,
                              hasError: 0 < l,
                            };
                            o.resolve(t), s(t);
                          }
                        },
                        e
                      )
                    );
                  },
                  c = 0;
                c < i.length;
                c++
              ) {
                var d = i[c];
                a = a
                  ? (function (e, t) {
                      return a
                        .then(function () {
                          return n(e, t);
                        })
                        .catch(function () {
                          return n(e, t);
                        });
                    })(d, c)
                  : n(d, c);
              }
              return o.promise;
            }
            S.warn('[aria2TaskService.retryTasks] callback is null');
          },
          removeTasks: function (e, t, a) {
            for (var n = [], i = [], s = 0; s < e.length; s++)
              'complete' === e[s].status ||
              'error' === e[s].status ||
              'removed' === e[s].status
                ? i.push(e[s].gid)
                : n.push(e[s].gid);
            var o = [],
              r = !1,
              l = !1,
              c = [];
            return (
              0 < n.length &&
                o.push(
                  p.forceRemoveMulti({
                    gids: n,
                    silent: !!a,
                    callback: function (e) {
                      k.pushArrayTo(c, e.results),
                        (r = r || e.hasSuccess),
                        (l = l || e.hasError);
                    },
                  })
                ),
              0 < i.length &&
                o.push(
                  p.removeDownloadResultMulti({
                    gids: i,
                    silent: !!a,
                    callback: function (e) {
                      k.pushArrayTo(c, e.results),
                        (r = r || e.hasSuccess),
                        (l = l || e.hasError);
                    },
                  })
                ),
              u.all(o).then(function () {
                t && t({ hasSuccess: !!r, hasError: !!l, results: c });
              })
            );
          },
          changeTaskPosition: function (e, t, a, n) {
            return p.changePosition({
              gid: e,
              pos: t,
              how: 'POS_SET',
              silent: !!n,
              callback: a,
            });
          },
          clearStoppedTasks: function (e, t) {
            return p.purgeDownloadResult({ silent: !!t, callback: e });
          },
          onConnectionSuccess: function (e) {
            e
              ? p.onConnectionSuccess({ callback: e })
              : S.warn(
                  '[aria2TaskService.onConnectionSuccess] callback is null'
                );
          },
          onConnectionFailed: function (e) {
            e
              ? p.onConnectionFailed({ callback: e })
              : S.warn(
                  '[aria2TaskService.onConnectionFailed] callback is null'
                );
          },
          onFirstSuccess: function (e) {
            e
              ? p.onFirstSuccess({ callback: e })
              : S.warn('[aria2TaskService.onFirstSuccess] callback is null');
          },
          onOperationSuccess: function (e) {
            e
              ? p.onOperationSuccess({ callback: e })
              : S.warn(
                  '[aria2TaskService.onOperationSuccess] callback is null'
                );
          },
          onOperationError: function (e) {
            e
              ? p.onOperationError({ callback: e })
              : S.warn('[aria2TaskService.onOperationError] callback is null');
          },
          onTaskCompleted: function (e) {
            e
              ? p.onDownloadComplete({
                  callback: t(this.getTaskStatus, e, 'completed'),
                })
              : S.warn('[aria2TaskService.onTaskCompleted] callback is null');
          },
          onBtTaskCompleted: function (e) {
            e
              ? p.onBtDownloadComplete({
                  callback: t(this.getTaskStatus, e, 'btcompleted'),
                })
              : S.warn('[aria2TaskService.onBtTaskCompleted] callback is null');
          },
          onTaskErrorOccur: function (e) {
            e
              ? p.onDownloadError({
                  callback: t(this.getTaskStatus, e, 'error'),
                })
              : S.warn('[aria2TaskService.onTaskErrorOccur] callback is null');
          },
          processDownloadTasks: function (e, t) {
            if (angular.isArray(e))
              for (var a = 0; a < e.length; a++) r(e[a], t);
            else
              S.warn(
                '[aria2TaskService.processDownloadTasks] tasks is not array',
                e
              );
          },
          getPieceStatus: function (e, t) {
            return D(e, t);
          },
          getCombinedPieces: function (e, t) {
            return (function (e, t) {
              for (var a = D(e, t), n = [], i = 0; i < a.length; i++) {
                var s = a[i];
                0 < n.length && n[n.length - 1].isCompleted === s
                  ? n[n.length - 1].count++
                  : n.push({ isCompleted: s, count: 1 });
              }
              return n;
            })(e, t);
          },
          estimateHealthPercentFromPeers: function (e, t) {
            if (!e || e.numPieces < 1 || t.length < 1)
              return (
                S.warn(
                  '[aria2TaskService.estimateHealthPercentFromPeers] tasks is null or numPieces < 1 or peers < 1',
                  e
                ),
                e.completePercent
              );
            for (
              var a = [], n = 0, i = e.completePercent, s = 0;
              s < e.numPieces;
              s++
            )
              a.push(0);
            for (s = 0; s < t.length; s++) {
              for (
                var o = t[s], r = D(o.bitfield, e.numPieces), l = 0, c = 0;
                c < r.length;
                c++
              ) {
                var d = r[c] ? 1 : 0;
                (a[c] += d), (l += d);
              }
              n < l
                ? ((n = l), (i = o.completePercent))
                : l === n && o.completePercent > i && (i = o.completePercent);
            }
            var u = 0;
            if (0 < a.length)
              for (;;) {
                var p = !0;
                for (s = 0; s < a.length; s++)
                  0 < a[s] ? (u++, a[s]--) : (p = !1);
                if (!p) break;
              }
            if (u <= n) return i;
            var g = (u / e.numPieces) * 100;
            return g <= i ? i : g;
          },
        };
      },
    ]);
  })(),
  (function () {
    'use strict';
    angular.module('ariaNg').factory('aria2SettingService', [
      'ariaNgConstants',
      'aria2AllOptions',
      'aria2GlobalAvailableOptions',
      'aria2QuickSettingsAvailableOptions',
      'aria2TaskAvailableOptions',
      'aria2RpcService',
      'ariaNgLogService',
      'ariaNgStorageService',
      function (o, p, t, a, r, s, n, l) {
        var c = function (e) {
          return o.settingHistoryKeyPrefix + '.' + e;
        };
        return {
          isOptionKeyValid: function (e) {
            return !!p[e];
          },
          getAvailableGlobalOptionsKeys: function (e) {
            return 'basic' === e
              ? t.basicOptions
              : 'http-ftp-sftp' === e
                ? t.httpFtpSFtpOptions
                : 'http' === e
                  ? t.httpOptions
                  : 'ftp-sftp' === e
                    ? t.ftpSFtpOptions
                    : 'bt' === e
                      ? t.btOptions
                      : 'metalink' === e
                        ? t.metalinkOptions
                        : 'rpc' === e
                          ? t.rpcOptions
                          : 'advanced' === e && t.advancedOptions;
          },
          getAria2QuickSettingsAvailableOptions: function (e) {
            return 'globalSpeedLimit' === e && a.globalSpeedLimitOptions;
          },
          getAvailableTaskOptionKeys: function (e, t) {
            for (var a = r.taskOptions, n = [], i = 0; i < a.length; i++) {
              var s = a[i],
                o = { key: s.key, category: s.category };
              (s.canShow && s.canShow.indexOf(e) < 0) ||
                ('http' === s.category && t) ||
                (('bittorrent' !== s.category || t) &&
                  (s.canUpdate &&
                    s.canUpdate.indexOf(e) < 0 &&
                    (o.readonly = !0),
                  n.push(o)));
            }
            return n;
          },
          getNewTaskOptionKeys: function () {
            for (var e = r.taskOptions, t = [], a = 0; a < e.length; a++) {
              var n = e[a],
                i = {
                  key: n.key,
                  category: n.category,
                  showHistory: n.showHistory,
                };
              (n.canShow && n.canShow.indexOf('new') < 0) ||
                (n.canUpdate &&
                  n.canUpdate.indexOf('new') < 0 &&
                  (i.readonly = !0),
                t.push(i));
            }
            return t;
          },
          getSpecifiedOptions: function (e, t) {
            var a = [];
            if (!e) return a;
            for (var n = 0; n < e.length; n++) {
              var i = e[n],
                s = !1,
                o = null,
                r = !1;
              if (angular.isObject(i)) {
                var l = i;
                (i = l.key),
                  (s = !!l.readonly),
                  (o = l.category),
                  (r = !!l.showHistory);
              }
              var c = p[i];
              if (c) {
                if (
                  ((c = angular.extend(
                    {
                      key: i,
                      nameKey: 'options.' + i + '.name',
                      descriptionKey: 'options.' + i + '.description',
                    },
                    c
                  )),
                  o && (c.category = o),
                  'boolean' === c.type && (c.options = ['true', 'false']),
                  s && (c.readonly = !0),
                  r && (c.showHistory = !0),
                  t && t.disableRequired && (c.required = !1),
                  c.options)
                ) {
                  for (var d = [], u = 0; u < c.options.length; u++)
                    d.push({
                      name: 'option.' + c.options[u],
                      value: c.options[u],
                    });
                  c.options = d;
                }
                a.push(c);
              }
            }
            return a;
          },
          getSettingHistory: function (e) {
            if (!this.isOptionKeyValid(e)) return [];
            for (
              var t = c(e), a = l.get(t) || [], n = [], i = 0;
              i < Math.min(a.length, o.historyMaxStoreCount);
              i++
            )
              n.push(a[i]);
            return n;
          },
          addSettingHistory: function (e, t) {
            if (!this.isOptionKeyValid(e)) return [];
            var a = c(e),
              n = l.get(a) || [],
              i = [];
            i.push(t);
            for (
              var s = 0;
              s < Math.min(n.length, o.historyMaxStoreCount - 1);
              s++
            )
              n[s] !== t && i.push(n[s]);
            return l.set(a, i), i;
          },
          clearSettingsHistorys: function () {
            for (
              var e = l.keys(o.settingHistoryKeyPrefix + '.'), t = 0;
              t < e.length;
              t++
            )
              l.remove(e[t]);
          },
          getGlobalOption: function (e, t) {
            return s.getGlobalOption({ silent: !!t, callback: e });
          },
          setGlobalOption: function (e, t, a, n) {
            var i = {};
            return (
              (i[e] = t),
              s.changeGlobalOption({ options: i, silent: !!n, callback: a })
            );
          },
          getAria2Status: function (e, t) {
            return s.getVersion({ silent: !!t, callback: e });
          },
          getGlobalStat: function (a, e) {
            return s.getGlobalStat({
              silent: !!e,
              callback: function (e) {
                if (a) {
                  var t = (function (e) {
                    if (!e) return e;
                    var t = parseInt(e.numActive) + parseInt(e.numWaiting);
                    return (e.totalRunningCount = t), e;
                  })(e);
                  a(t);
                } else
                  n.warn(
                    '[aria2SettingService.getGlobalStat] callback is null'
                  );
              },
            });
          },
          saveSession: function (e, t) {
            return s.saveSession({ silent: !!t, callback: e });
          },
          shutdown: function (e, t) {
            return s.shutdown({ silent: !!t, callback: e });
          },
        };
      },
    ]);
  })(),
  angular.module('ariaNg').run([
    '$templateCache',
    function (e) {
      e.put(
        'views/debug.html',
        '<section class="content no-padding ng-cloak" ng-if="enableDebugMode()"><div class="nav-tabs-custom"><ul class="nav nav-tabs"><li class="active"><a class="pointer-cursor" ng-bind="(\'format.debug.latest-logs\' | translate: {count: logMaxCount})">Latest Logs</a></li><li class="slim"><a class="pointer-cursor" ng-click="reloadLogs()"><i class="fa fa-refresh"></i></a></li></ul><div class="tab-content no-padding"><div class="settings-table striped hoverable"><div class="row" ng-repeat="log in logs | reverse"><div class="col-sm-12"><span class="label label-default" ng-bind="\'#\' + ($index + 1)"></span> <span ng-bind="log.time | longDate"></span> <span class="label" ng-class="{\'DEBUG\':\'label-default\', \'INFO\':\'label-primary\', \'WARN\':\'label-warning\', \'ERROR\':\'label-danger\'}[log.level]" ng-bind="log.level"></span> <span ng-bind="log.content"></span> <a class="pointer-cursor" ng-click="showLogDetail(log)" ng-if="log.attachment"><i class="fa fa-file-o"></i> <span translate>Show Detail</span></a></div></div></div></div></div><div id="log-detail-modal" class="modal fade" tabindex="-1" role="dialog"><div class="modal-dialog modal-lg" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" translate>Log Detail</h4></div><div class="modal-body no-padding"><div class="settings-table striped"><div class="row"><div class="col-sm-12"><span ng-bind="currentLog.time | longDate"></span> <span class="label" ng-class="{\'DEBUG\':\'label-default\', \'INFO\':\'label-primary\', \'WARN\':\'label-warning\', \'ERROR\':\'label-danger\'}[currentLog.level]" ng-bind="currentLog.level"></span> <span ng-bind="currentLog.content"></span></div></div><div class="row" ng-if="currentLog.attachment"><div class="col-sm-12"><pre ng-bind="currentLog.attachment | json"></pre></div></div></div></div></div></div></div></section>'
      ),
        e.put(
          'views/list.html',
          '<section class="content no-padding"><div id="task-table" class="task-table"><div class="task-table-title"><div class="row"><div class="col-md-8 col-sm-7"><div class="row"><div class="col-sm-8"><a ng-click="changeDisplayOrder(\'name:asc\', true)" translate>File Name</a> <i class="fa" ng-class="{\'fa-sort-asc fa-order-asc\': isSetDisplayOrder(\'name:asc\'), \'fa-sort-desc fa-order-desc\': isSetDisplayOrder(\'name:desc\')}"></i></div><div class="col-sm-4"><a ng-click="changeDisplayOrder(\'size:asc\', true)" translate>File Size</a> <i class="fa" ng-class="{\'fa-sort-asc fa-order-asc\': isSetDisplayOrder(\'size:asc\'), \'fa-sort-desc fa-order-desc\': isSetDisplayOrder(\'size:desc\')}"></i></div></div></div><div class="col-md-2 col-sm-3"><div class="row"><div class="col-sm-6"><a ng-click="changeDisplayOrder(\'percent:desc\', true)" translate>Progress</a> <i class="fa" ng-class="{\'fa-sort-asc fa-order-asc\': isSetDisplayOrder(\'percent:asc\'), \'fa-sort-desc fa-order-desc\': isSetDisplayOrder(\'percent:desc\')}"></i></div><div class="col-sm-6"><a ng-click="changeDisplayOrder(\'remain:asc\', true)" translate>Remaining</a> <i class="fa" ng-class="{\'fa-sort-asc fa-order-asc\': isSetDisplayOrder(\'remain:asc\'), \'fa-sort-desc fa-order-desc\': isSetDisplayOrder(\'remain:desc\')}"></i></div></div></div><div class="col-md-2 col-sm-2"><a ng-click="changeDisplayOrder(\'dspeed:desc\', true)" translate>Download Speed</a> <i class="fa" ng-class="{\'fa-sort-asc fa-order-asc\': isSetDisplayOrder(\'dspeed:asc\'), \'fa-sort-desc fa-order-desc\': isSetDisplayOrder(\'dspeed:desc\')}"></i></div></div></div><div class="task-table-body" ng-class="{\'draggable\': isSupportDragTask()}" dragula="\'task-list\'" dragula-model="taskContext.list"><div class="row pointer-cursor" ng-repeat="task in taskContext.list | filter: filterTask | taskOrderBy: getOrderType()" data-gid="{{task.gid}}" data-selected="{{!!taskContext.selected[task.gid]}}" data-toggle="context" data-target="#task-table-contextmenu" ng-click="taskContext.selected[task.gid] = !taskContext.selected[task.gid]"><div class="col-md-8 col-sm-7 col-xs-12"><div class="checkbox checkbox-primary" ng-class="{\'checkbox-hide\': !taskContext.selected[task.gid]}"><input id="{{\'task_\' + task.gid}}" type="checkbox" ng-model="taskContext.selected[task.gid]"> <label for="{{\'task_\' + task.gid}}"><span class="task-name auto-ellipsis" ng-bind="task.taskName" title="{{task.taskName}}"></span></label></div><div class="task-files"><span ng-bind="task.totalLength | readableVolume"></span> <a ng-href="#!/task/detail/{{task.gid}}" title="{{\'Click to view task detail\' | translate}}"><span ng-if="task.files" ng-bind="(\'format.settings.file-count\' | translate: {count: task.selectedFileCount})"></span> </a><i class="icon-error fa fa-times" ng-if="task && task.status === \'error\' && task.errorDescription" title="{{task.errorDescription | translate}}"></i><i class="icon-seeder fa fa-arrow-up" ng-if="task && task.status === \'active\' && task.seeder" title="{{\'Seeding\' | translate}}"></i> <a ng-if="isTaskRetryable(task)" ng-click="retryTask(task)" title="{{\'Retry\' | translate}}" translate>Retry</a></div></div><div class="col-md-2 col-sm-3 col-xs-12"><div class="progress"><div class="progress-bar" role="progressbar" ng-class="{\'progress-bar-primary\': task.status !== \'error\', \'progress-bar-warning\': task.status === \'error\'}" aria-valuenow="{{task.completePercent}}" aria-valuemin="1" aria-valuemax="100" ng-style="{ width: task.completePercent + \'%\' }"><span ng-class="{\'progress-lower\': task.completePercent < 50}" ng-bind="(task.completePercent | percent: 2) + \'%\'"></span></div></div><div><span class="task-last-time" ng-bind="task.status === \'waiting\' ? \'--:--:--\' : (task.status === \'paused\' ? \'\' : (task.status === \'active\' ? ((0 <= task.remainTime && task.remainTime < 86400) ? (task.remainTime | dateDuration: \'second\': \'HH:mm:ss\') : (\'More Than One Day\' | translate)) : \'\'))"></span> <span class="task-download-speed visible-xs-inline pull-right" ng-bind="(task.status === \'active\' && !task.verifyIntegrityPending && !task.verifiedLength ? (!task.seeder || task.downloadSpeed > 0 ? (task.downloadSpeed | readableVolume) + \'/s\' : \'-\') : (task | taskStatus: true | translate: {errorcode: task.errorCode, verifiedPercent: task.verifiedPercent}))"></span> <span class="task-seeders pull-right" ng-bind="task.status === \'active\' ? ((task.numSeeders ? (task.numSeeders + \'/\') : \'\') + task.connections) : \'\'"></span></div></div><div class="col-md-2 col-sm-2 hidden-xs"><span class="task-download-speed" title="{{task.status === \'active\' ? ((\'Download Speed\' | translate) + \': \' + (task.downloadSpeed | readableVolume) + \'/s\') + (task.bittorrent ? \', \' + (\'Upload Speed\' | translate) + \': \' + (task.uploadSpeed | readableVolume) + \'/s\' : \'\') : \'\'}}" ng-bind="(task.status === \'active\' && !task.verifyIntegrityPending && !task.verifiedLength ? (!task.seeder || task.downloadSpeed > 0 ? (task.downloadSpeed | readableVolume) + \'/s\' : \'-\') : (task | taskStatus: true | translate: {errorcode: task.errorCode, verifiedPercent: task.verifiedPercent}))"></span></div><div class="task-right-arrow visible-md visible-lg"><a ng-href="#!/task/detail/{{task.gid}}" title="{{\'Click to view task detail\' | translate}}"><i class="fa fa-angle-right"></i></a></div></div></div><div id="task-table-contextmenu"><ul class="dropdown-menu" role="menu"><li ng-if="isSelectedTaskRetryable()"><a tabindex="-1" class="pointer-cursor" title="{{\'Retry Selected Tasks\' | translate}}" ng-click="retryTasks()"><i class="fa fa-refresh fa-fw"></i> <span translate>Retry Selected Tasks</span></a></li><li class="divider" ng-if="isSelectedTaskRetryable()"></li><li ng-if="isSpecifiedTaskSelected(\'paused\')"><a tabindex="-1" class="pointer-cursor" title="{{\'Start\' | translate}}" ng-click="changeTasksState(\'start\')"><i class="fa fa-play fa-fw"></i> <span translate>Start</span></a></li><li ng-if="isSpecifiedTaskSelected(\'active\', \'waiting\')"><a tabindex="-1" class="pointer-cursor" title="{{\'Pause\' | translate}}" ng-click="changeTasksState(\'pause\')"><i class="fa fa-pause fa-fw"></i> <span translate>Pause</span></a></li><li ng-if="isTaskSelected()"><a tabindex="-1" class="pointer-cursor" title="{{\'Delete\' | translate}}" ng-click="removeTasks()"><i class="fa fa-trash-o fa-fw"></i> <span translate>Delete</span></a></li><li class="divider" ng-if="isTaskSelected()"></li><li class="dropdown dropdown-submenu"><a tabindex="-1" title="{{\'Display Order\' | translate}}" href="javascript:void(0);"><i class="fa fa-sort-alpha-asc fa-fw"></i> <span translate>Display Order</span></a><ul class="dropdown-menu" style="right: 160px;"><li><a class="pointer-cursor" ng-click="changeDisplayOrder(\'default:asc\')"><span translate>Default</span> <i class="fa fa-fw" ng-class="{\'fa-check\': isSetDisplayOrder(\'default\')}"></i></a></li><li><a class="pointer-cursor" ng-click="changeDisplayOrder(\'name:asc\')"><span translate>By File Name</span> <i class="fa fa-fw" ng-class="{\'fa-check\': isSetDisplayOrder(\'name\')}"></i></a></li><li><a class="pointer-cursor" ng-click="changeDisplayOrder(\'size:asc\')"><span translate>By File Size</span> <i class="fa fa-fw" ng-class="{\'fa-check\': isSetDisplayOrder(\'size\')}"></i></a></li><li><a class="pointer-cursor" ng-click="changeDisplayOrder(\'percent:desc\')"><span translate>By Progress</span> <i class="fa fa-fw" ng-class="{\'fa-check\': isSetDisplayOrder(\'percent\')}"></i></a></li><li><a class="pointer-cursor" ng-click="changeDisplayOrder(\'remain:asc\')"><span translate>By Remaining</span> <i class="fa fa-fw" ng-class="{\'fa-check\': isSetDisplayOrder(\'remain\')}"></i></a></li><li><a class="pointer-cursor" ng-click="changeDisplayOrder(\'dspeed:desc\')"><span translate>By Download Speed</span> <i class="fa fa-fw" ng-class="{\'fa-check\': isSetDisplayOrder(\'dspeed\')}"></i></a></li><li><a class="pointer-cursor" ng-click="changeDisplayOrder(\'uspeed:desc\')"><span translate>By Upload Speed</span> <i class="fa fa-fw" ng-class="{\'fa-check\': isSetDisplayOrder(\'uspeed\')}"></i></a></li></ul></li><li ng-if="hasRetryableTask()"><a tabindex="-1" class="pointer-cursor" title="{{\'Select All Failed Tasks\' | translate}}" ng-click="selectAllFailedTasks()"><i class="fa fa-fw"></i> <span translate>Select All Failed Tasks</span></a></li><li ng-if="hasCompletedTask()"><a tabindex="-1" class="pointer-cursor" title="{{\'Select All Completed Tasks\' | translate}}" ng-click="selectAllCompletedTasks()"><i class="fa fa-fw"></i> <span translate>Select All Completed Tasks</span></a></li><li><a tabindex="-1" class="pointer-cursor" title="{{\'Select All\' | translate}}" ng-click="selectAllTasks()"><i class="fa fa-th-large fa-fw"></i> <span translate>Select All</span></a></li><li class="divider" ng-if="isSelectedTasksAllHaveUrl() || isSelectedTasksAllHaveInfoHash()"></li><li ng-if="isSelectedTasksAllHaveUrl()"><a tabindex="-1" class="pointer-cursor" title="{{\'Copy Download Url\' | translate}}" ng-click="copySelectedTasksDownloadLink()"><i class="fa fa-copy fa-fw"></i> <span translate>Copy Download Url</span></a></li><li ng-if="isSelectedTasksAllHaveInfoHash()"><a tabindex="-1" class="pointer-cursor" title="{{\'Copy Magnet Link\' | translate}}" ng-click="copySelectedTasksMagnetLink()"><i class="fa fa-copy fa-fw"></i> <span translate>Copy Magnet Link</span></a></li></ul></div></div></section>'
        ),
        e.put(
          'views/new.html',
          '<section class="content no-padding"><form name="newTaskForm" ng-submit="startDownload()" novalidate><div class="nav-tabs-custom"><ul class="nav nav-tabs"><li ng-class="{\'active\': context.currentTab === \'links\'}"><a class="pointer-cursor" ng-click="changeTab(\'links\')" ng-bind="(context.taskType === \'torrent\' ? \'Torrent File\' : (context.taskType === \'metalink\' ? \'Metalink File\' : \'Links\') | translate)">Links</a></li><li ng-class="{\'active\': context.currentTab === \'options\'}"><a class="pointer-cursor" ng-click="changeTab(\'options\')" translate>Options</a></li><li class="divider"></li><li class="nav-toolbar"><div class="btn-group"><button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown"><i class="fa fa-folder-open-o fa-1_1x"></i></button><ul class="dropdown-menu right-align"><li><a class="pointer-cursor" ng-click="openTorrent()" translate>Open Torrent File</a></li><li><a class="pointer-cursor" ng-click="openMetalink()" translate>Open Metalink File</a></li></ul></div><div class="btn-group"><button type="submit" class="btn btn-sm" ng-class="{\'btn-default\': !context.uploadFile && newTaskForm.$invalid, \'btn-success\': context.uploadFile || !newTaskForm.$invalid}" ng-disabled="!context.uploadFile && newTaskForm.$invalid" translate>Download Now</button>&nbsp; <button type="button" class="btn btn-sm dropdown-toggle" ng-class="{\'btn-default\': !context.uploadFile && newTaskForm.$invalid, \'btn-success\': context.uploadFile || !newTaskForm.$invalid}" ng-disabled="!context.uploadFile && newTaskForm.$invalid" data-toggle="dropdown"><span class="caret"></span></button><ul class="dropdown-menu right-align"><li><a class="pointer-cursor" ng-click="startDownload(true)" translate>Download Later</a></li></ul></div></li></ul><div class="tab-content no-padding"><div class="tab-pane" ng-class="{\'active\': context.currentTab === \'links\'}"><div class="new-task-table" ng-if="context.taskType === \'urls\'"><div class="row"><div class="col-sm-12"><p ng-bind="\'format.task.new.download-links\' | translate: {count: getValidUrlsCount()}">Download Links:</p><div class="form-group has-feedback no-margin" ng-class="{ \'has-error\' : newTaskForm.urls.$invalid && newTaskForm.urls.$dirty, \'has-success\' : newTaskForm.urls.$valid && newTaskForm.urls.$dirty }"><textarea name="urls" class="form-control" rows="10" autofocus="autofocus" ng-auto-focus ng-valid-urls ng-model="context.urls" ng-required="true" ng-keydown="urlTextboxKeyDown($event)" ng-placeholder="\'Support multiple URLs, one URL per line.\' | translate"></textarea><div class="form-control-icon" ng-if="newTaskForm.urls.$dirty"><i class="fa form-control-feedback" ng-class="{\'fa-check\':newTaskForm.urls.$valid, \'fa-times\':newTaskForm.urls.$invalid}"></i></div></div></div></div></div><div class="new-task-table" ng-if="context.taskType === \'torrent\' || context.taskType === \'metalink\'"><div class="row"><div class="col-sm-12"><p translate>File Name:</p><input class="form-control" ng-value="context.uploadFile ? context.uploadFile.fileName : \'\'" readonly="readonly"></div></div></div><input id="file-holder" type="file" style="display: none"></div><div class="tab-pane" ng-class="{\'active\': context.currentTab === \'options\'}"><div class="settings-table striped hoverable"><div class="settings-table-title new-task-filter-title"><div class="row"><div class="col-sm-12"><span translate>Filters</span><span>:&nbsp;</span><div class="checkbox checkbox-inline checkbox-primary"><input id="optionFilterGlobal" type="checkbox" ng-model="context.optionFilter[\'global\']"> <label for="optionFilterGlobal" translate>Global</label></div><div class="checkbox checkbox-inline checkbox-primary"><input id="optionFilterHttp" type="checkbox" ng-model="context.optionFilter[\'http\']"> <label for="optionFilterHttp" translate>Http</label></div><div class="checkbox checkbox-inline checkbox-primary"><input id="optionFilterBittorrent" type="checkbox" ng-model="context.optionFilter[\'bittorrent\']"> <label for="optionFilterBittorrent" translate>BitTorrent</label></div></div></div></div><ng-setting ng-repeat="option in context.availableOptions" ng-if="context.optionFilter[option.category]" option="option" lazy-save-timeout="0" default-value="context.globalOptions[option.key]" on-change-value="setOption(key, value, optionStatus)"></ng-setting></div></div></div></div></form></section>'
        ),
        e.put(
          'views/notification-reloadable.html',
          '<div class="ui-notification custom-template"><div class="message" ng-bind-html="message"></div><div class="message"><a class="btn btn-small btn-primary close-notification" ng-click="refreshPage()" translate>Reload AriaNg</a></div></div>'
        ),
        e.put(
          'views/setting-dialog.html',
          '<div id="quickSettingModal" class="modal fade" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" ng-bind="(setting ? (setting.title) : \'Shortcut\') | translate">Shortcut</h4></div><div class="modal-body overlay-wrapper no-padding"><div class="settings-table striped hoverable"><ng-setting ng-repeat="option in context.availableOptions" option="option" ng-model="context.globalOptions[option.key]" default-value="option.defaultValue" on-change-value="setGlobalOption(key, value, optionStatus)"></ng-setting></div><div class="overlay" ng-if="context.isLoading"><i class="fa fa-refresh fa-spin"></i></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal" translate>Cancel</button></div></div>\x3c!-- /.modal-content --\x3e</div>\x3c!-- /.modal-dialog --\x3e</div>\x3c!-- /.modal --\x3e'
        ),
        e.put(
          'views/setting.html',
          '<div class="row" data-option-key="{{option.key}}"><div class="setting-key setting-key-without-desc col-sm-4"><span ng-bind="option.nameKey | translate"></span> <em ng-bind="\'(\' + option.key + \')\'"></em> <i class="icon-primary fa fa-question-circle" ng-if="(option.descriptionKey | translate) !== \'\'" data-toggle="popover" data-trigger="hover" data-placement="auto top" data-container="body" data-content="{{option.descriptionKey | translate}}"></i> <span class="description" ng-if="option.showCount && option.split && optionValue" ng-bind="\'format.settings.total-count\' | translate: {count: getTotalCount()}"></span> <i class="icon-primary fa fa-info-circle" ng-if="(option.since && option.since !== \'\')" ng-tooltip="{{(\'format.requires.aria2-version\' | translate: {version: option.since})}}" ng-tooltip-container="body" ng-tooltip-placement="right"></i></div><div class="setting-value col-sm-8"><div ng-class="{\'input-group\': !!option.suffix}"><div class="form-group has-feedback" ng-class="[optionStatus.getStatusFeedbackStyle()]"><input class="form-control" type="text" placeholder="{{::placeholder}}" ng-disabled="!!option.readonly" ng-if="(option.type === \'string\' && !option.showHistory) || option.type === \'integer\' || option.type === \'float\'" ng-model="optionValue" ng-change="changeValue(optionValue, true)"><input-dropdown input-class-name="form-control" style="width: 100%;" input-placeholder="{{::placeholder}}" ng-if="option.type === \'string\' && option.showHistory" disabled="!!option.readonly" ng-model="optionValue" selected-item="optionValue" allow-custom-input="true" only-show-non-empty-dropdown="true" default-dropdown-items="history" filter-list-method="filterHistory(userInput)" value-changed-method="changeValue(value, from === \'input\')"></input-dropdown><textarea class="form-control" rows="6" placeholder="{{::placeholder}}" ng-disabled="!!option.readonly" ng-if="option.type === \'text\'" ng-model="optionValue" ng-change="changeValue(optionValue, true)"></textarea> <select class="form-control" style="width: 100%;" ng-disabled="!!option.readonly" ng-class="{\'placeholder\': !optionValue}" ng-if="option.type === \'boolean\' || option.type === \'option\'" ng-model="optionValue" ng-change="changeValue(optionValue, false)" ng-options="item.value as (item.name | translate) for item in option.options"><option value="" disabled="disabled" ng-bind="(placeholder | translate)" style="display: none;"></option></select><div class="form-control-icon" ng-if="optionStatus.isShowStatusIcon()"><i class="fa form-control-feedback" ng-class="[optionStatus.getStatusIcon()]"></i></div></div><span class="input-group-addon" ng-if="!!option.suffix" ng-bind="option.suffix | translate"></span></div></div></div>'
        ),
        e.put(
          'views/settings-aria2.html',
          '<section class="content no-padding"><div class="settings-table striped hoverable"><ng-setting ng-repeat="option in context.availableOptions" option="option" ng-model="context.globalOptions[option.key]" default-value="option.defaultValue" on-change-value="setGlobalOption(key, value, optionStatus)"></ng-setting></div></section>'
        ),
        e.put(
          'views/settings-ariang.html',
          '<section class="content no-padding"><div class="nav-tabs-custom"><ul class="nav nav-tabs"><li ng-class="{\'active\': isCurrentGlobalTab()}"><a class="pointer-cursor" ng-click="changeGlobalTab()" translate>Global</a></li><li class="nav-tab-title-rpcname" ng-repeat="setting in context.rpcSettings" ng-class="{\'active\': isCurrentRpcTab($index)}"><a class="pointer-cursor" ng-click="changeRpcTab($index)"><span class="nav-tab-rpcname" ng-bind="\'RPC\' + (setting.rpcAlias || setting.rpcHost ? \' (\' + (setting.rpcAlias ? setting.rpcAlias : setting.rpcHost + \':\' + setting.rpcPort) + \')\' : \'\')" title="{{(setting.rpcAlias ? setting.rpcAlias : setting.rpcHost + \':\' + setting.rpcPort)}}">RPC</span> </a><a class="pointer-cursor nav-tab-close" ng-if="!setting.isDefault" title="{{\'Delete RPC Setting\' | translate}}"><i class="fa fa-times" ng-click="removeRpcSetting(setting)"></i></a></li><li class="slim"><a class="pointer-cursor" ng-click="addNewRpcSetting()" title="{{\'Add New RPC Setting\' | translate}}"><i class="fa fa-plus"></i></a></li></ul><div class="tab-content no-padding"><div class="tab-pane" ng-class="{\'active\': isCurrentGlobalTab()}"><div class="settings-table striped hoverable"><div class="row" ng-if="context.ariaNgVersion"><div class="setting-key col-sm-4"><span translate>AriaNg Version</span></div><div class="setting-value col-sm-8" ng-bind="context.ariaNgVersion + (context.buildCommit ? \' (\' + context.buildCommit + \')\' : \'\')"></div></div><div class="row"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Language</span></div><div class="setting-value col-sm-8"><select class="form-control" style="width: 100%;" ng-model="context.settings.language" ng-options="type as ((((\'languages.\' + language.name) | translate) !== (\'languages.\' + language.name) ? ((\'languages.\' + language.name) | translate) : language.name) + \' (\' + language.displayName + \')\') for (type, language) in context.languages" ng-change="setLanguage(context.settings.language)"></select></div></div><div class="row"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Theme</span></div><div class="setting-value col-sm-8"><select class="form-control" style="width: 100%;" ng-model="context.settings.theme" ng-change="setTheme(context.settings.theme)"><option value="light" translate>Light</option><option value="dark" translate>Dark</option><option ng-if="context.isSupportDarkMode" value="system" translate>Follow system settings</option></select></div></div><div class="row" ng-if="context.showDebugMode"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Debug Mode</span></div><div class="setting-value col-sm-8"><select class="form-control" style="width: 100%;" ng-model="context.sessionSettings.debugMode" ng-options="option.value as (option.name | translate) for option in context.trueFalseOptions" ng-change="setDebugMode(context.sessionSettings.debugMode)"></select></div></div><div class="row"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Page Title</span> <i class="icon-primary fa fa-question-circle" data-toggle="popover" data-trigger="hover" data-placement="auto right" data-container="body" data-html="true" data-content="{{(\'Supported Placeholder\' | translate) + \':<br/>\' +\n                               (\'AriaNg Title\' | translate) + \': ${title}<br/>\' +\n                               (\'Current RPC Alias\' | translate) + \': ${rpcprofile}<br/>\' +\n                               (\'Downloading Count\' | translate) + \': ${downloading}<br/>\' +\n                                (\'Waiting Count\' | translate) + \': ${waiting}<br/>\' +\n                                (\'Stopped Count\' | translate) + \': ${stopped}<br/>\' +\n                                (\'Download Speed\' | translate) + \': ${downspeed}<br/>\' +\n                                (\'Upload Speed\' | translate) + \': ${upspeed}<br/><br/>\' +\n                                (\'Tips: You can use the &quot;noprefix&quot; tag to ignore the prefix, &quot;nosuffix&quot; tag to ignore the suffix, and &quot;scale=n&quot; tag to set the decimal precision.\' | translate) + \'<br/>\' +\n                                (\'Example: ${downspeed:noprefix:nosuffix:scale=1}\' | translate)}}"></i></div><div class="setting-value col-sm-8"><input class="form-control" type="text" ng-model="context.settings.title" ng-change="setTitle(context.settings.title); updateTitlePreview()"> <em>[<span translate>Preview</span>] <span ng-bind="context.titlePreview"></span></em></div></div><div class="row" ng-if="isSupportNotification()"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Enable Browser Notification</span></div><div class="setting-value col-sm-8"><select class="form-control" style="width: 100%;" ng-model="context.settings.browserNotification" ng-change="setEnableBrowserNotification(context.settings.browserNotification)" ng-options="option.value as (option.name | translate) for option in context.trueFalseOptions"></select></div></div><div class="row"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Updating Page Title Interval</span> <span class="asterisk">*</span></div><div class="setting-value col-sm-8"><select class="form-control" style="width: 100%;" ng-model="context.settings.titleRefreshInterval" ng-change="setTitleRefreshInterval(context.settings.titleRefreshInterval)" ng-options="time.optionValue as (time.name | translate: {value: time.value}) for time in context.availableTime"></select></div></div><div class="row"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Updating Global Stat Interval</span> <span class="asterisk">*</span></div><div class="setting-value col-sm-8"><select class="form-control" style="width: 100%;" ng-model="context.settings.globalStatRefreshInterval" ng-change="setGlobalStatRefreshInterval(context.settings.globalStatRefreshInterval)" ng-options="time.optionValue as (time.name | translate: {value: time.value}) for time in context.availableTime"></select></div></div><div class="row"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Updating Task Information Interval</span> <span class="asterisk">*</span></div><div class="setting-value col-sm-8"><select class="form-control" style="width: 100%;" ng-model="context.settings.downloadTaskRefreshInterval" ng-change="setDownloadTaskRefreshInterval(context.settings.downloadTaskRefreshInterval)" ng-options="time.optionValue as (time.name | translate: {value: time.value}) for time in context.availableTime"></select></div></div><div class="row"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Swipe Gesture</span></div><div class="setting-value col-sm-8"><select class="form-control" style="width: 100%;" ng-model="context.settings.swipeGesture" ng-change="setSwipeGesture(context.settings.swipeGesture)" ng-options="option.value as (option.name | translate) for option in context.trueFalseOptions"></select></div></div><div class="row"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Change Tasks Order by Drag-and-drop</span></div><div class="setting-value col-sm-8"><select class="form-control" style="width: 100%;" ng-model="context.settings.dragAndDropTasks" ng-change="setDragAndDropTasks(context.settings.dragAndDropTasks)" ng-options="option.value as (option.name | translate) for option in context.trueFalseOptions"></select></div></div><div class="row"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>RPC List Display Order</span> <span class="asterisk">*</span></div><div class="setting-value col-sm-8"><select class="form-control" style="width: 100%;" ng-model="context.settings.rpcListDisplayOrder" ng-change="setRPCListDisplayOrder(context.settings.rpcListDisplayOrder)"><option value="recentlyUsed" translate>Recently Used</option><option value="rpcAlias" translate>RPC Alias</option></select></div></div><div class="row"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Action After Creating New Tasks</span></div><div class="setting-value col-sm-8"><select class="form-control" style="width: 100%;" ng-model="context.settings.afterCreatingNewTask" ng-change="setAfterCreatingNewTask(context.settings.afterCreatingNewTask)"><option value="task-list" translate>Navigate to Task List Page</option><option value="task-detail" translate>Navigate to Task Detail Page</option></select></div></div><div class="row"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Action After Retrying Task</span></div><div class="setting-value col-sm-8"><select class="form-control" style="width: 100%;" ng-model="context.settings.afterRetryingTask" ng-change="setAfterRetryingTask(context.settings.afterRetryingTask)"><option value="task-list-downloading" translate>Navigate to Downloading Tasks Page</option><option value="task-detail" translate>Navigate to Task Detail Page</option><option value="stay-on-current" translate>Stay on Current Page</option></select></div></div><div class="row"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Remove Old Tasks After Retrying</span></div><div class="setting-value col-sm-8"><select class="form-control" style="width: 100%;" ng-model="context.settings.removeOldTaskAfterRetrying" ng-change="setRemoveOldTaskAfterRetrying(context.settings.removeOldTaskAfterRetrying)" ng-options="option.value as (option.name | translate) for option in context.trueFalseOptions"></select></div></div><div class="row"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Confirm Task Removal</span></div><div class="setting-value col-sm-8"><select class="form-control" style="width: 100%;" ng-model="context.settings.confirmTaskRemoval" ng-change="setConfirmTaskRemoval(context.settings.confirmTaskRemoval)" ng-options="option.value as (option.name | translate) for option in context.trueFalseOptions"></select></div></div><div class="row"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Include Prefix When Copying From Task Details</span></div><div class="setting-value col-sm-8"><select class="form-control" style="width: 100%;" ng-model="context.settings.includePrefixWhenCopyingFromTaskDetails" ng-change="setIncludePrefixWhenCopyingFromTaskDetails(context.settings.includePrefixWhenCopyingFromTaskDetails)" ng-options="option.value as (option.name | translate) for option in context.trueFalseOptions"></select></div></div><div class="row"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Show Pieces Info In Task Detail Page</span></div><div class="setting-value col-sm-8"><select class="form-control" style="width: 100%;" ng-model="context.settings.showPiecesInfoInTaskDetailPage" ng-change="setShowPiecesInfoInTaskDetailPage(context.settings.showPiecesInfoInTaskDetailPage)"><option value="always" translate>Always</option><option value="le102400" translate translate-values="{value: \'102,400\'}">Pieces Amount is Less than or Equal to {value}</option><option value="le10240" translate translate-values="{value: \'10,240\'}">Pieces Amount is Less than or Equal to {value}</option><option value="le1024" translate translate-values="{value: \'1,024\'}">Pieces Amount is Less than or Equal to {value}</option><option value="never" translate>Never</option></select></div></div><div class="row"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Import / Export AriaNg Settings</span></div><div class="setting-value col-sm-8"><button class="btn btn-sm btn-default" ng-click="showImportSettingsModal()"><span translate>Import Settings</span></button> <button class="btn btn-sm btn-default" ng-click="showExportSettingsModal()"><span translate>Export Settings</span></button></div></div><div class="row tip no-background no-hover"><span class="asterisk">*</span> <span translate>Changes to the settings take effect after refreshing page.</span> <button class="btn btn-xs btn-default" ng-click="resetSettings()"><span translate>Reset Settings</span></button> <button class="btn btn-xs btn-default" ng-click="clearHistory()"><span translate>Clear Settings History</span></button></div></div></div><div class="tab-pane" ng-repeat="setting in context.rpcSettings" ng-class="{\'active\': isCurrentRpcTab($index)}"><div class="settings-table striped hoverable"><div class="row"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Aria2 RPC Alias</span> <span class="asterisk">*</span></div><div class="setting-value col-sm-8"><input class="form-control" type="text" ng-placeholder="(setting.rpcHost ? setting.rpcHost + \':\' + setting.rpcPort : \'\')" ng-model="setting.rpcAlias" ng-change="updateRpcSetting(setting, \'rpcAlias\')"></div></div><div class="row"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Aria2 RPC Address</span> <span class="asterisk">*</span></div><div class="setting-value col-sm-8"><div class="input-group input-group-multiple"><span class="input-group-addon" ng-bind="setting.protocol + \'://\'"></span> <input class="form-control" type="text" ng-model="setting.rpcHost" ng-change="updateRpcSetting(setting, \'rpcHost\')"> <span class="input-group-addon">:</span><div class="input-group-addon-container"><input class="form-control form-control-rpcport" type="text" ng-model="setting.rpcPort" ng-change="updateRpcSetting(setting, \'rpcPort\')"></div><span class="input-group-addon">/</span><div class="input-group-addon-container"><input class="form-control form-control-rpcinterface" type="text" ng-model="setting.rpcInterface" ng-change="updateRpcSetting(setting, \'rpcInterface\')"></div></div></div></div><div class="row"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Aria2 RPC Protocol</span> <span class="asterisk">*</span> <i class="icon-primary fa fa-question-circle" ng-tooltip-container="body" ng-tooltip-placement="top" ng-tooltip="{{\'Http and WebSocket would be disabled when accessing AriaNg via Https.\' | translate}}"></i></div><div class="setting-value col-sm-8"><select class="form-control" style="width: 100%;" ng-model="setting.protocol" ng-change="updateRpcSetting(setting, \'protocol\')"><option value="http" ng-disabled="::(context.isInsecureProtocolDisabled)" ng-bind="(\'Http\' + (context.isInsecureProtocolDisabled ? \' (Disabled)\' : \'\')) | translate">Http</option><option value="https" translate>Https</option><option value="ws" ng-disabled="::(context.isInsecureProtocolDisabled)" ng-bind="(\'WebSocket\' + (context.isInsecureProtocolDisabled ? \' (Disabled)\' : \'\')) | translate">WebSocket</option><option value="wss" translate>WebSocket (Security)</option></select></div></div><div class="row" ng-if="setting.protocol === \'http\' || setting.protocol === \'https\'"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Aria2 RPC Http Request Method</span> <span class="asterisk">*</span> <i class="icon-primary fa fa-question-circle" ng-tooltip-container="body" ng-tooltip-placement="top" ng-tooltip="{{\'POST method only supports aria2 v1.15.2 and above.\' | translate}}"></i></div><div class="setting-value col-sm-8"><select class="form-control" style="width: 100%;" ng-model="setting.httpMethod" ng-change="updateRpcSetting(setting, \'httpMethod\')"><option value="POST" translate>POST</option><option value="GET" translate>GET</option></select></div></div><div class="row"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Aria2 RPC Secret Token</span> <span class="asterisk">*</span></div><div class="setting-value col-sm-8"><div class="input-group"><input class="form-control" type="{{context.showRpcSecret ? \'text\' : \'password\'}}" ng-model="setting.secret" ng-change="updateRpcSetting(setting, \'secret\')"> <span class="input-group-addon input-group-addon-compact no-vertical-padding"><button class="btn btn-xs btn-default" title="{{context.showRpcSecret ? \'Hide Secret\' : \'Show Secret\' | translate}}" ng-class="{\'active\': context.showRpcSecret}" ng-click="context.showRpcSecret = !context.showRpcSecret"><i class="fa fa-eye"></i></button></span></div></div></div><div class="row tip no-background no-hover"><span class="asterisk">*</span> <span translate>Changes to the settings take effect after refreshing page.</span> <button class="btn btn-xs btn-default" ng-disabled="setting.isDefault" ng-click="setDefaultRpcSetting(setting)"><span translate>Activate</span></button></div></div></div></div></div><div id="import-settings-modal" class="modal fade" tabindex="-1" role="dialog"><div class="modal-dialog modal-lg" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title"><span translate>Import Settings</span> <small><a class="pointer-cursor" title="{{\'Open\' | translate}}" ng-click="openAriaNgConfigFile()"><i class="icon-primary fa fa-folder-open-o"></i></a></small></h4></div><div class="modal-body no-padding"><div class="settings-table striped"><input id="import-file-holder" type="file" style="display: none"> <textarea class="form-control" ng-model="context.importSettings" rows="20" ng-placeholder="\'AriaNg settings data\' | translate"></textarea></div></div><div class="modal-footer"><button type="button" class="btn btn-primary" ng-disabled="!context.importSettings || !context.importSettings.length" ng-click="importSettings(context.importSettings)" translate>Import</button> <button type="button" class="btn btn-default" data-dismiss="modal" translate>Cancel</button></div></div></div></div><div id="export-settings-modal" class="modal fade" tabindex="-1" role="dialog"><div class="modal-dialog modal-lg" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title"><span translate>Export Settings</span> <small><a class="pointer-cursor" title="{{\'Save\' | translate}}" ng-if="context.isSupportBlob" ng-blob-download="context.exportSettings" ng-file-name="AriaNgConfig.json" ng-content-type="application/json"><i class="icon-primary fa fa-save"></i> </a><a class="pointer-cursor" title="{{\'Copy\' | translate}}" ng-click="copyExportSettings()"><i class="icon-primary fa fa-copy"></i> </a><span class="label label-default fade-in" ng-if="context.exportSettingsCopied" translate>Data has been copied to clipboard.</span></small></h4></div><div class="modal-body no-padding"><div class="settings-table striped"><textarea class="form-control" ng-model="context.exportSettings" rows="20" readonly="readonly"></textarea></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal" translate>Cancel</button></div></div></div></div></section>'
        ),
        e.put(
          'views/status.html',
          '<section class="content no-padding"><div class="settings-table striped hoverable"><div class="row"><div class="setting-key col-sm-4"><span translate>Aria2 RPC Address</span></div><div class="setting-value col-sm-8"><span ng-bind="context.host"></span></div></div><div class="row"><div class="setting-key col-sm-4"><span translate>Aria2 Status</span></div><div class="setting-value col-sm-8"><span class="label" ng-class="{\'label-primary\': context.status === \'Connecting\', \'label-success\': context.status === \'Connected\', \'label-danger\': context.status === \'Disconnected\'}" ng-bind="context.status | translate"></span></div></div><div class="row ng-cloak" ng-if="context.serverStatus"><div class="setting-key col-sm-4"><span translate>Aria2 Version</span></div><div class="setting-value col-sm-8"><span ng-bind="context.serverStatus.version"></span></div></div><div class="row ng-cloak" ng-if="context.serverStatus"><div class="setting-key col-sm-4"><span translate>Enabled Features</span></div><div class="setting-value col-sm-8"><div class="checkbox checkbox-primary checkbox-compact default-cursor" ng-repeat="feature in context.serverStatus.enabledFeatures"><input id="{{\'feature_\' + $index}}" type="checkbox" checked="checked" disabled="disabled" class="default-cursor"> <label for="{{\'feature_\' + $index}}" class="text-cursor"><span ng-bind="feature"></span></label></div></div></div><div class="row ng-cloak" ng-if="context.serverStatus"><div class="setting-key setting-key-without-desc col-sm-4"><span translate>Operations</span></div><div class="setting-value col-sm-8"><button class="btn btn-sm btn-primary" ng-click="saveSession()" promise-btn><span translate>Save Session</span></button> <button class="btn btn-sm btn-danger promise-btn-style" ng-click="shutdown()"><span translate>Shutdown Aria2</span></button></div></div></div></section>'
        ),
        e.put(
          'views/task-detail.html',
          '<section class="content no-padding"><div class="nav-tabs-custom"><ul class="nav nav-tabs" ng-if="task"><li ng-class="{\'active\': context.currentTab === \'overview\'}"><a class="pointer-cursor" ng-click="changeTab(\'overview\')" translate>Overview</a></li><li ng-class="{\'active\': context.currentTab === \'pieces\'}" ng-if="context.showPiecesInfo"><a class="pointer-cursor" ng-click="changeTab(\'pieces\')" translate>Pieces</a></li><li ng-class="{\'active\': context.currentTab === \'filelist\'}"><a class="pointer-cursor" ng-click="changeTab(\'filelist\')" translate>Files</a></li><li ng-class="{\'active\': context.currentTab === \'btpeers\'}" ng-if="task && task.status === \'active\' && task.bittorrent"><a class="pointer-cursor" ng-click="changeTab(\'btpeers\')" translate>Peers</a></li><li ng-class="{\'active\': context.currentTab === \'settings\'}" ng-if="task && (task.status === \'active\' || task.status === \'waiting\' || task.status === \'paused\')" class="slim"><a class="pointer-cursor" ng-click="changeTab(\'settings\')"><i class="fa fa-gear"></i></a></li></ul><div class="tab-content no-padding"><div class="tab-pane" ng-class="{\'active\': context.currentTab === \'overview\'}"><div id="overview-items" class="settings-table striped hoverable" ng-mousedown="onOverviewMouseDown()" data-toggle="context" data-target="#task-overview-contextmenu"><div class="row" ng-if="task"><div class="setting-key col-sm-4"><span translate>Task Name</span></div><div class="setting-value col-sm-8"><span class="allow-word-break" ng-bind="task.taskName" ng-tooltip-container="body" ng-tooltip-placement="bottom" ng-tooltip="{{(task.bittorrent && task.bittorrent.comment) ? task.bittorrent.comment : task.taskName}}"></span></div></div><div class="row" ng-if="task"><div class="setting-key col-sm-4"><span translate>Task Size</span></div><div class="setting-value col-sm-8"><span ng-bind="task.totalLength | readableVolume"></span> <a class="pointer-cursor" ng-if="task.files" ng-click="changeTab(\'filelist\')"><span ng-bind="(\'format.settings.file-count\' | translate: {count: task.selectedFileCount})"></span></a></div></div><div class="row" ng-if="task"><div class="setting-key col-sm-4"><span translate>Task Status</span></div><div class="setting-value col-sm-8"><span ng-bind="task | taskStatus | translate: {errorcode: task.errorCode, verifiedPercent: task.verifiedPercent}"></span> <i class="icon-primary fa fa-question-circle" ng-if="task.errorCode && task.errorCode != \'0\' && task.errorMessage" ng-tooltip="{{task.errorMessage}}" ng-tooltip-container="body" ng-tooltip-placement="top"></i></div></div><div class="row" ng-if="task && task.status === \'error\' && task.errorDescription"><div class="setting-key col-sm-4"><span translate>Error Description</span></div><div class="setting-value col-sm-8"><span ng-bind="task.errorDescription | translate"></span></div></div><div class="row" ng-if="task"><div class="setting-key col-sm-4"><span ng-bind="(\'Progress\' | translate) + (task.status === \'active\' && task.bittorrent ? \' (\' + (\'Health Percentage\' | translate) + \')\' : \'\')"></span></div><div class="setting-value col-sm-8"><span ng-bind="(task.completePercent | percent: 2) + \'%\' + (task.status === \'active\' && task.bittorrent ? \' (\' + (context.healthPercent | percent: 2) + \'%\' + \')\' : \'\')"></span></div></div><div class="row" ng-if="task"><div class="setting-key col-sm-4"><span translate>Download</span></div><div class="setting-value col-sm-8"><span ng-bind="(task.completedLength | readableVolume) + (task.status === \'active\' ? \' @ \' + (task.downloadSpeed | readableVolume) + \'/s\' : \'\')"></span></div></div><div class="row" ng-if="task && task.bittorrent"><div class="setting-key col-sm-4"><span translate>Upload</span></div><div class="setting-value col-sm-8"><span ng-bind="(task.uploadLength | readableVolume) + (task.status === \'active\' ? \' @ \' + (task.uploadSpeed | readableVolume) + \'/s\' : \'\')"></span></div></div><div class="row" ng-if="task && task.bittorrent"><div class="setting-key col-sm-4"><span translate>Share Ratio</span></div><div class="setting-value col-sm-8"><span ng-bind="(task.shareRatio | number: 2)"></span></div></div><div class="row" ng-if="task && task.status === \'active\' && task.completedLength < task.totalLength"><div class="setting-key col-sm-4"><span translate>Remaining</span></div><div class="setting-value col-sm-8"><span ng-bind="0 <= task.remainTime && task.remainTime < 86400? (task.remainTime | dateDuration: \'second\': \'HH:mm:ss\') : (\'More Than One Day\' | translate)"></span></div></div><div class="row" ng-if="task && task.status === \'active\'"><div class="setting-key col-sm-4"><span ng-bind="(task.bittorrent ? (\'Seeders\' | translate) + \' / \' : \'\') + (\'Connections\' | translate)">Connections</span></div><div class="setting-value col-sm-8"><span ng-bind="(task.numSeeders ? (task.numSeeders + \' / \') : \'\') + task.connections"></span></div></div><div class="row" ng-if="task && task.bittorrent && task.bittorrent.creationDate"><div class="setting-key col-sm-4"><span translate>Seed Creation Time</span></div><div class="setting-value col-sm-8"><span ng-bind="task.bittorrent.creationDate | amFromUnix | longDate"></span></div></div><div class="row" ng-if="task && task.infoHash"><div class="setting-key col-sm-4"><span translate>Info Hash</span></div><div class="setting-value col-sm-8"><span class="allow-word-break" ng-bind="task.infoHash"></span></div></div><div class="row" ng-if="task && task.singleUrl"><div class="setting-key col-sm-4"><span translate>Download Url</span></div><div class="setting-value col-sm-8"><span class="allow-word-break" ng-bind="task.singleUrl"></span></div></div><div class="row" ng-if="task"><div class="setting-key col-sm-4"><span translate>Download Dir</span></div><div class="setting-value col-sm-8"><span class="allow-word-break" ng-bind="task.dir"></span></div></div><div class="row" ng-if="task && task.bittorrent && task.bittorrent.announceList && task.bittorrent.announceList.length > 0"><div class="setting-key col-sm-4"><span translate>BT Tracker Servers</span> <em class="description-inline" ng-bind="\'format.settings.total-count\' | translate: {count: task.bittorrent.announceList.length}"></em> <i class="icon-expand pointer-cursor fa" ng-if="task.bittorrent.announceList.length > 1" ng-class="{\'fa-plus\': context.collapseTrackers, \'fa-minus\': !context.collapseTrackers}" ng-click="context.collapseTrackers = !context.collapseTrackers" title="{{(context.collapseTrackers ? \'Expand\' : \'Collapse\') | translate}}"></i></div><div class="setting-value col-sm-8"><span class="multi-line auto-ellipsis" ng-bind="serverAddress.length ? serverAddress.join(\',\') : serverAddress" title="{{serverAddress.length ? serverAddress.join(\',\') : serverAddress}}" ng-repeat="serverAddress in task.bittorrent.announceList | limitTo: (context.collapseTrackers ? 1 : task.bittorrent.announceList.length)"></span></div></div></div><div class="settings-table"><div class="row no-hover no-background" ng-if="context.isEnableSpeedChart && task && task.status === \'active\'"><div class="col-sm-12"><div class="task-status-chart-wrapper"><ng-chart ng-data="context.statusData" ng-theme="currentTheme" height="200"></ng-chart></div></div></div></div></div><div class="tab-pane" ng-class="{\'active\': context.currentTab === \'pieces\'}" ng-if="context.showPiecesInfo"><div class="piece-legends"><div class="piece-legend" title="{{(\'format.task.pieceinfo\' | translate: {completed: task.completedPieces, total: task.numPieces})}}"><div class="piece piece-completed"></div><span translate>Completed</span></div><div class="piece-legend" title="{{(\'format.task.pieceinfo\' | translate: {completed: task.completedPieces, total: task.numPieces})}}"><div class="piece"></div><span translate>Uncompleted</span></div></div><ng-piece-map bit-field="task.bitfield" piece-count="task.numPieces"></ng-piece-map></div><div class="tab-pane" ng-class="{\'active\': context.currentTab === \'filelist\'}"><div class="task-table"><div class="task-table-title"><div class="row"><div class="col-sm-8"><a ng-click="changeFileListDisplayOrder(\'name:asc\', true)" ng-class="{true: \'default-cursor\'}[task.multiDir]" translate>File Name</a> <i ng-if="!task.multiDir" class="fa" ng-class="{\'fa-sort-asc fa-order-asc\': isSetFileListDisplayOrder(\'name:asc\'), \'fa-sort-desc fa-order-desc\': isSetFileListDisplayOrder(\'name:desc\')}"></i> <a ng-click="showChooseFilesToolbar()" ng-if="task && task.files && task.files.length > 1 && (task.status === \'waiting\' || task.status === \'paused\')" translate>(Choose Files)</a></div><div class="col-sm-2"><a ng-click="changeFileListDisplayOrder(\'percent:desc\', true)" ng-class="{true: \'default-cursor\'}[task.multiDir]" translate>Progress</a> <i ng-if="!task.multiDir" class="fa" ng-class="{\'fa-sort-asc fa-order-asc\': isSetFileListDisplayOrder(\'percent:asc\'), \'fa-sort-desc fa-order-desc\': isSetFileListDisplayOrder(\'percent:desc\')}"></i></div><div class="col-sm-2"><a ng-click="changeFileListDisplayOrder(\'size:asc\', true)" ng-class="{true: \'default-cursor\'}[task.multiDir]" translate>File Size</a> <i ng-if="!task.multiDir" class="fa" ng-class="{\'fa-sort-asc fa-order-asc\': isSetFileListDisplayOrder(\'size:asc\'), \'fa-sort-desc fa-order-desc\': isSetFileListDisplayOrder(\'size:desc\')}"></i></div></div></div><div class="task-table-title" ng-if="context.showChooseFilesToolbar"><div class="row"><div class="col-sm-12"><div class="btn-group"><button type="button" class="btn btn-primary btn-xs" ng-click="selectFiles(\'auto\')" ng-bind="(isAllFileSelected() ? \'Select None\' : \'Select All\') | translate">Select All</button> <button type="button" class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span></button><ul class="dropdown-menu"><li><a href="javascript:void(0);" ng-click="selectFiles(\'all\')" translate>Select All</a></li><li><a href="javascript:void(0);" ng-click="selectFiles(\'none\')" translate>Select None</a></li><li><a href="javascript:void(0);" ng-click="selectFiles(\'reverse\')" translate>Select Invert</a></li></ul></div><button class="btn btn-xs btn-default" ng-click="chooseSpecifiedFiles(\'video\')"><i class="fa fa-file-video-o"></i> <span translate>Videos</span></button> <button class="btn btn-xs btn-default" ng-click="chooseSpecifiedFiles(\'audio\')"><i class="fa fa-file-audio-o"></i> <span translate>Audios</span></button> <button class="btn btn-xs btn-default" ng-click="chooseSpecifiedFiles(\'picture\')"><i class="fa fa-file-picture-o"></i> <span translate>Pictures</span></button> <button class="btn btn-xs btn-default" ng-click="chooseSpecifiedFiles(\'document\')"><i class="fa fa-file-text-o"></i> <span translate>Documents</span></button> <button class="btn btn-xs btn-default" ng-click="chooseSpecifiedFiles(\'application\')"><i class="fa fa-file-o"></i> <span translate>Applications</span></button> <button class="btn btn-xs btn-default" ng-click="chooseSpecifiedFiles(\'archive\')"><i class="fa fa-file-archive-o"></i> <span translate>Archives</span></button> <button class="btn btn-xs btn-default" ng-click="showCustomChooseFileModal()"><i class="fa fa-filter"></i> <span translate>Custom</span></button> <button class="btn btn-xs btn-success" ng-click="saveChoosedFiles()" ng-disabled="!isAnyFileSelected()" translate>Confirm</button> <button class="btn btn-xs btn-default" ng-click="cancelChooseFiles()" translate>Cancel</button></div></div></div><div class="task-table-body"><div class="row" ng-repeat="file in task.files | fileOrderBy: getFileListOrderType()" data-toggle="context" data-target="#task-filelist-contextmenu" ng-if="!context.collapsedDirs[file.relativePath]" data-file-index="{{file.index}}"><div class="col-sm-10" ng-if="file.isDir" style="{{(task.multiDir ? (\'padding-left: \' + (file.level * 16) + \'px\') : \'\')}}"><i class="icon-dir-expand pointer-cursor fa" ng-click="collapseDir(file)" ng-class="{true: \'fa-plus\', false: \'fa-minus\'}[!!context.collapsedDirs[file.nodePath]]" title="{{(context.collapsedDirs[file.nodePath] ? \'Expand\' : \'Collapse\') | translate}}"></i><div class="checkbox checkbox-primary checkbox-inline"><input id="{{\'node_\' + file.nodePath}}" type="checkbox" ng-disabled="!task || !task.files || task.files.length <= 1 || (task.status !== \'waiting\' && task.status !== \'paused\')" ng-model="file.selected" ng-indeterminate="file.partialSelected" ng-change="setSelectedNode(file)"> <label for="{{\'node_\' + file.nodePath}}" class="allow-word-break" ng-bind="file.nodeName" title="{{file.nodeName}}"></label></div></div><div class="col-sm-8" ng-if="!file.isDir" style="{{(task.multiDir ? (\'padding-left: \' + (11 + 6 + file.level * 16) + \'px\') : \'\')}}"><div class="checkbox checkbox-primary"><input id="{{\'file_\' + file.index}}" type="checkbox" ng-disabled="!task || !task.files || task.files.length <= 1 || (task.status !== \'waiting\' && task.status !== \'paused\')" ng-model="file.selected" ng-change="setSelectedFile(true)"> <label for="{{\'file_\' + file.index}}" class="allow-word-break" ng-bind="file.fileName" title="{{file.fileName}}"></label></div></div><div class="col-sm-2" ng-if="!file.isDir"><div class="progress"><div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="{{file.completePercent}}" aria-valuemin="1" aria-valuemax="100" ng-style="{ width: file.completePercent + \'%\' }"><span ng-class="{\'progress-lower\': file.completePercent < 50}" ng-bind="(file.completePercent | percent: 2) + \'%\'"></span></div></div></div><div class="col-sm-2"><span class="task-size" ng-bind="file.length | readableVolume"></span></div></div></div></div></div><div class="tab-pane" ng-class="{\'active\': context.currentTab === \'btpeers\'}" ng-if="task && task.status === \'active\' && task.bittorrent"><div class="task-table"><div class="task-table-title"><div class="row"><div class="col-md-4 col-sm-4"><a ng-click="changePeerListDisplayOrder(\'address:asc\', true)" translate>Address</a> <i class="fa" ng-class="{\'fa-sort-asc fa-order-asc\': isSetPeerListDisplayOrder(\'address:asc\'), \'fa-sort-desc fa-order-desc\': isSetPeerListDisplayOrder(\'address:desc\')}"></i> <span>/</span> <a ng-click="changePeerListDisplayOrder(\'client:asc\', true)" translate>Client</a> <i class="fa" ng-class="{\'fa-sort-asc fa-order-asc\': isSetPeerListDisplayOrder(\'client:asc\'), \'fa-sort-desc fa-order-desc\': isSetPeerListDisplayOrder(\'client:desc\')}"></i></div><div class="col-md-5 col-sm-4"><div class="row"><div class="col-sm-6"><span translate>Status</span></div><div class="col-sm-6 text-right"><a ng-click="changePeerListDisplayOrder(\'percent:desc\', true)" translate>Progress</a> <i class="fa" ng-class="{\'fa-sort-asc fa-order-asc\': isSetPeerListDisplayOrder(\'percent:asc\'), \'fa-sort-desc fa-order-desc\': isSetPeerListDisplayOrder(\'percent:desc\')}"></i></div></div></div><div class="col-md-3 col-sm-4"><a ng-click="changePeerListDisplayOrder(\'dspeed:desc\', true)" translate>Download</a> <i class="fa" ng-class="{\'fa-sort-asc fa-order-asc\': isSetPeerListDisplayOrder(\'dspeed:asc\'), \'fa-sort-desc fa-order-desc\': isSetPeerListDisplayOrder(\'dspeed:desc\')}"></i> <span>/</span> <a ng-click="changePeerListDisplayOrder(\'uspeed:desc\', true)" translate>Upload</a> <i class="fa" ng-class="{\'fa-sort-asc fa-order-asc\': isSetPeerListDisplayOrder(\'uspeed:asc\'), \'fa-sort-desc fa-order-desc\': isSetPeerListDisplayOrder(\'uspeed:desc\')}"></i> <span translate>Speed</span></div></div></div><div class="task-table-body"><div class="row" ng-repeat="peer in context.btPeers | peerOrderBy: getPeerListOrderType()" data-toggle="context" data-target="#task-peerlist-contextmenu"><div class="col-md-4 col-sm-4 col-xs-12"><div class="peer-name-wrapper auto-ellipsis" title="{{(peer.client ? peer.client.info : \'\') + (peer.seeder ? (peer.client.info ? \', \' : \'\') + (\'Seeding\' | translate) : \'\')}}"><span ng-bind="peer.name | translate"></span><i class="icon-seeder fa fa-angle-double-up" ng-if="peer && peer.seeder"></i> <span class="peer-client" ng-if="!!peer.client" ng-bind="peer.client ? (\'(\' + peer.client.name + (peer.client.version ? \' \' + peer.client.version : \'\') + \')\') : \'\'"></span></div></div><div class="col-md-5 col-sm-4 col-xs-12"><div class="row"><div class="col-md-9 col-sm-7 col-xs-12"><div class="piece-bar-wrapper"><ng-piece-bar bit-field="peer.bitfield" piece-count="task.numPieces" color="#208fe5"></ng-piece-bar></div></div><div class="col-md-3 col-sm-5 hidden-xs text-right"><span ng-bind="(peer.completePercent | percent: 2) + \'%\'"></span></div></div></div><div class="visible-xs col-xs-4"><span ng-bind="(peer.completePercent | percent: 2) + \'%\'"></span></div><div class="col-md-3 col-sm-4 col-xs-8"><div class="task-peer-download-speed"><i class="icon-download fa fa-arrow-down"></i> <span ng-bind="(peer.downloadSpeed | readableVolume) + \'/s\'"></span>&nbsp; <i class="icon-upload fa fa-arrow-up"></i> <span ng-bind="(peer.uploadSpeed | readableVolume) + \'/s\'"></span></div></div></div><div class="row" ng-if="!context.btPeers || context.btPeers.length < 1"><div class="col-sm-12 text-center"><span translate>No connected peers</span></div></div></div></div></div><div class="tab-pane" ng-class="{\'active\': context.currentTab === \'settings\'}" ng-if="task && (task.status === \'active\' || task.status === \'waiting\' || task.status === \'paused\')"><div class="settings-table striped hoverable"><ng-setting ng-repeat="option in context.availableOptions" option="option" ng-model="context.options[option.key]" default-value="option.defaultValue" on-change-value="setOption(key, value, optionStatus)"></ng-setting></div></div></div></div>\x3c!-- /.nav-tabs-custom --\x3e<div id="task-overview-contextmenu"><ul class="dropdown-menu" role="menu"><li><a id="mnu-overview-copy" tabindex="-1" class="mnu-copy pointer-cursor" title="{{\'Copy\' | translate}}" ng-click="copySelectedRowText()"><i class="fa fa-copy fa-fw"></i> <span translate>Copy</span></a></li></ul></div><div id="task-filelist-contextmenu"><ul class="dropdown-menu" role="menu"><li ng-if="task.multiDir"><a tabindex="-1" class="pointer-cursor" title="{{\'Expand All\' | translate}}" ng-click="collapseAllDirs(false)"><i class="fa fa-plus fa-fw"></i> <span translate>Expand All</span></a></li><li ng-if="task.multiDir"><a tabindex="-1" class="pointer-cursor" title="{{\'Collapse All\' | translate}}" ng-click="collapseAllDirs(true)"><i class="fa fa-minus fa-fw"></i> <span translate>Collapse All</span></a></li><li class="dropdown dropdown-submenu" ng-if="!task.multiDir"><a tabindex="-1" title="{{\'Display Order\' | translate}}" href="javascript:void(0);"><i class="fa fa-sort-alpha-asc fa-fw"></i> <span translate>Display Order</span></a><ul class="dropdown-menu" style="right: 160px;"><li><a class="pointer-cursor" ng-click="changeFileListDisplayOrder(\'default:asc\')"><span translate>Default</span> <i class="fa fa-fw" ng-class="{\'fa-check\': isSetFileListDisplayOrder(\'default\')}"></i></a></li><li><a class="pointer-cursor" ng-click="changeFileListDisplayOrder(\'name:asc\')"><span translate>By File Name</span> <i class="fa fa-fw" ng-class="{\'fa-check\': isSetFileListDisplayOrder(\'name\')}"></i></a></li><li><a class="pointer-cursor" ng-click="changeFileListDisplayOrder(\'percent:desc\')"><span translate>By Progress</span> <i class="fa fa-fw" ng-class="{\'fa-check\': isSetFileListDisplayOrder(\'percent\')}"></i></a></li><li><a class="pointer-cursor" ng-click="changeFileListDisplayOrder(\'size:asc\')"><span translate>By File Size</span> <i class="fa fa-fw" ng-class="{\'fa-check\': isSetFileListDisplayOrder(\'size\')}"></i></a></li><li><a class="pointer-cursor" ng-click="changeFileListDisplayOrder(\'selected:desc\')"><span translate>By Selected Status</span> <i class="fa fa-fw" ng-class="{\'fa-check\': isSetFileListDisplayOrder(\'selected\')}"></i></a></li></ul></li></ul></div><div id="task-peerlist-contextmenu"><ul class="dropdown-menu" role="menu"><li class="dropdown dropdown-submenu"><a tabindex="-1" title="{{\'Display Order\' | translate}}" href="javascript:void(0);"><i class="fa fa-sort-alpha-asc fa-fw"></i> <span translate>Display Order</span></a><ul class="dropdown-menu" style="right: 160px;"><li><a class="pointer-cursor" ng-click="changePeerListDisplayOrder(\'default:asc\')"><span translate>Default</span> <i class="fa fa-fw" ng-class="{\'fa-check\': isSetPeerListDisplayOrder(\'default\')}"></i></a></li><li><a class="pointer-cursor" ng-click="changePeerListDisplayOrder(\'address:asc\')"><span translate>By Peer Address</span> <i class="fa fa-fw" ng-class="{\'fa-check\': isSetPeerListDisplayOrder(\'address\')}"></i></a></li><li><a class="pointer-cursor" ng-click="changePeerListDisplayOrder(\'client:asc\')"><span translate>By Client Name</span> <i class="fa fa-fw" ng-class="{\'fa-check\': isSetPeerListDisplayOrder(\'client\')}"></i></a></li><li><a class="pointer-cursor" ng-click="changePeerListDisplayOrder(\'percent:desc\')"><span translate>By Progress</span> <i class="fa fa-fw" ng-class="{\'fa-check\': isSetPeerListDisplayOrder(\'percent\')}"></i></a></li><li><a class="pointer-cursor" ng-click="changePeerListDisplayOrder(\'dspeed:desc\')"><span translate>By Download Speed</span> <i class="fa fa-fw" ng-class="{\'fa-check\': isSetPeerListDisplayOrder(\'dspeed\')}"></i></a></li><li><a class="pointer-cursor" ng-click="changePeerListDisplayOrder(\'uspeed:desc\')"><span translate>By Upload Speed</span> <i class="fa fa-fw" ng-class="{\'fa-check\': isSetPeerListDisplayOrder(\'uspeed\')}"></i></a></li></ul></li></ul></div><div id="custom-choose-file-modal" class="modal fade" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" translate>Custom Choose File</h4></div><div class="modal-body no-padding"><div class="settings-table striped hoverable"><div class="row" ng-repeat="(extensionTypeName, extensionTypeInfo) in context.fileExtensions"><div class="setting-key setting-key-without-desc col-sm-4" ng-bind="extensionTypeInfo.name | translate"></div><div class="setting-value col-sm-8"><div class="checkbox checkbox-primary checkbox-inline" ng-repeat="info in extensionTypeInfo.extensions"><input id="{{info.extension}}" type="checkbox" ng-model="info.selected" ng-indeterminate="info.selectedCount > 0 && info.unSelectedCount > 0" ng-change="setSelectedExtension(info.extension, info.selected)"> <label for="{{info.extension}}" ng-bind="info.extension"></label></div></div></div></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal" translate>Close</button></div></div></div></div></section>'
        );
    },
  ]);
