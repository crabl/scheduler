var schedule = require('schedulejs');
var later = require('later');
var moment = require('moment');

var date_format = 'ddd, Do, HH:MM';

var awake_time = later.parse.text('every weekday after 5:30am and before 11pm');
var start_date = moment('2015-09-15');

var constraints = [{
  name: '1',
  available: 'after 5:30am and before 11pm on Monday through Thursday and after 5:30am and before 9pm on Friday'
}, {
  name: '2',
  available: 'after 5pm on Monday, Wednesday, and Friday'
}];

var items = [{
  name: 'Work',
  duration: 8,
  timeboxes: 1, // needs to be done in a single timebox
  available: 'every weekday after 7:30am',
  constraints: []
}, {
  name: 'Something',
  timeboxes: 1,
  duration: 1,
  constraints: []
}];

function itemsToTasks(items) {
  return schedule
    .tasks()
    .id(item => item.name)
    .duration(item => item.duration * 60)
    .available(item => item.available ? later.parse.text(item.available) : undefined)
    .minSchedule(item => item.timebox ? item.duration / item.timeboxes : undefined)
    .resources(item => item.constraints)(items);
}

function constraintsToResources(constraints) {
  return schedule
    .resources()
    .id(res => res.name)
    .available(res => res.available ? later.parse.text(res.available) : undefined)(constraints);
}

var tasks = itemsToTasks(items);
var resources = constraintsToResources(constraints);

var calendar = schedule.create(tasks, resources, awake_time, start_date);

for(var id in calendar.scheduledTasks) {
  var st = calendar.scheduledTasks[id];
  // console.log(st);
  console.log(id);
  console.log(st.duration / 60);
  console.log(moment(st.earlyStart).format(date_format));
  console.log(moment(st.earlyFinish).format(date_format));
}
