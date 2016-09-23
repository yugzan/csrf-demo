CSRF DEMO
=============
The purpose is don't need to using Thymeleaf
I don't want build backend script with HTML script.


####Web development environment
	$ sudo apt-get install npm
	$ sudo npm install -g bower
	$ sudo npm install -g gulp
####Build
	$ sudo npm install
	$ bower install
	$ gulp build

gulp build will move /app to ../src/main/resources/auth

How to Start
-------------------
```bash
> [$~/ProjectPath/] gradle clean build

> [$~/ProjectPath/] java -jar build/libs/csrf-demo.jar
```
