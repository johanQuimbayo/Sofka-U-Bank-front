process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function(config) {
    config.set({
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('@angular-devkit/build-angular/plugins/karma'),
            require('karma-sonarqube-reporter')
        ],
        reporters: ['progress', 'sonarqube', 'coverage'],
        browsers: ['Chrome'],
        coverageReporter: {
            dir: require('path').join(__dirname, 'coverage'),
            reporters: [
                { type: 'lcov', subdir: '.' },
                { type: 'text-summary' }
            ]
        },
        sonarqubeReporter: {
            basePath: 'src/app',
            outputFolder: 'reports',
            filePattern: '**/*spec.ts',
            encoding: 'utf-8',
            legacyMode: false,
            reportName: () => {
                return 'sonarqube_report.xml';
            }
        },
        singleRun: true,
        customLaunchers: {
            HeadlessChrome: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--disable-gpu']
            }
        }
    });
};