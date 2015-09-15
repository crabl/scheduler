var schedule = require('schedulejs');
var later = require('later');
var moment = require('moment');

schedule.date.localTime(); // Use local time

var date_format = 'ddd, Do, HH:mm';
var awake_time = 'every weekday after 5:30am and before 11pm';
var start_date = '2015-09-15';

var constraints = require('./data/constraints.json');
var items = require('./data/tasks.json');

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

var calendar = schedule.create(tasks, resources, later.parse.text(awake_time), moment(start_date));

var st = calendar.scheduledTasks;
var keys = Object.keys(st)

keys.map(key => {
  return {
    name: key,
    duration: st[key].duration / 60,
    start: moment(st[key].earlyStart).format(date_format),
    finish: moment(st[key].earlyFinish).format(date_format)
  };
}).forEach(item => {
  console.log(`${item.name} (${item.duration} hours)`);
  console.log(`${item.start} to ${item.finish}`);
});
