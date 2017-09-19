import nconf from 'nconf'

nconf.defaults({
    intel: {
        'formatters': {
            'details': {
                'format': '[%(date)s] %(levelname)s: %(message)s',
                'colorize': true
            }
        },
        'handlers': {
            'terminal': {
                'class': 'intel/handlers/console',
                'formatter': 'details',
                'level': 'DEBUG'
            }
        },
        'loggers': {
            'common': {
                'handlers': ['terminal'],
                'level': 'DEBUG',
                'handleExceptions': true,
                'exitOnError': false,
                'propagate': false
            }
        }
    }
})
