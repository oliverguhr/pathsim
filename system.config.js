(function() {

	// Alias the path to the common rc1 vendor scripts.
	/*var paths = {
		"rc1/*": "../../vendor/angularjs-2-beta/rc1/*"
	};*/

	// Tell Angular how normalize path and package aliases.
	var  map = {
		"angular": "https://ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular.min.js",
        "lodash": "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.7.0/lodash.min.js",
        "js-priority-queue": "https://raw.githubusercontent.com/adamhooper/js-priority-queue/v0.1.5/priority-queue.min.js",
        						
		//"ts": "rc1/node_modules/plugin-typescript/lib/plugin.js",
		//"tsconfig.json": "rc1/tsconfig.json",
		//"typescript": "rc1/node_modules/typescript/lib/typescript.js"
	};

	// Setup meta data for individual areas of the application.
	var packages = {
		"dist": { 
			main: "App",
			defaultExtension: "js"
		},
		"node_modules": {
			defaultExtension: "js"
		}
	};

	/*var ngPackageNames = [
		"common",
		"compiler",
		"core",
		"http",
		"platform-browser",
		"platform-browser-dynamic",
		"router",
		"router-deprecated",
		"upgrade"
	];
	
	ngPackageNames.forEach(
		function iterator( packageName ) {
			
			packages[ "@angular/" + packageName ] = {
				main: ( packageName  + ".umd.js" )
				// ,
				// defaultExtension: "js"
			};

		}
	);*/

	System.config({		
		map: map,
		packages: packages,	
        meta: {
           'angular': {
            format: 'global',
            exports: 'angular'
        },
    }					
	});

	// Load "./app/main.ts" (gets full path from package configuration above).
	System        
		.import("dist")        
		.then(
			function handleResolve() {
				console.info( "System.js successfully bootstrapped app." );                      
			},
			function handleReject( error ) {
				console.warn( "System.js could not bootstrap the app." );
				console.error( error );

			}
		)
	;

})();