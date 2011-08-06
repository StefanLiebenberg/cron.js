Crontab.start();
Crontab.add(new Cron( "@second" , function () { console.log( "Every Second" ) } ));
Crontab.add(new Cron( "0 0 * * * *", function () { console.log( "Every Hour" )} ));
Crontab.add(new Cron( "0 0 0 * * *", function () { console.log( "Every Day" ) } ));
 
 


