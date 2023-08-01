NEW_DATA_SET_ID = -100;
DUMMY_GROUP_ID = -1000;

TIMELINE_OPTIONS = {
  stack: false,
  showCurrentTime: false,
  selectable: false,
  editable: false,
  moment: function(date) {
      return vis.moment(date).utc();
  },
  format: {
    minorLabels: {
      week: 'D',
    }
  }
};

var newDataSetItem = {
  id: NEW_DATA_SET_ID,
  type: 'background',
  className: 'goodNewDataSet',
  start: new Date(),
  end: new Date(),
  content: 'New Data Set',
  title: 'New Date Set'
}

function processNewDataSet(eventType) {
  // Remove the existing entry
  timeline.itemsData.getDataSet().remove(newDataSetItem);

  if (null == PF('pStartDate').getDate()) {
    newDataSetItem['start'] = null;
  } else {
    newDataSetItem['start'] = getDateField('pStartDate');
  }

  if (null == PF('pEndDate').getDate()) {
    newDataSetItem['end'] = null;
  } else {
    newDataSetItem['end'] = getDateField('pEndDate');
  }
  let validData = validateNewDataSet();
  if (validData) {
    newDataSetItem['className'] = 'goodNewDataSet';
  } else {
    newDataSetItem['className'] = 'badNewDataSet';
  }
  if (eventType == 'start') {
    var s = PF('pDataSetName').jq;
    s.val(s.data('platform-code') + makeUTCyyyymmdd(newDataSetItem['start']));
    s.css('animationName', 'rowFlash').css('animationDuration', '1s');
  }
  newDataSetItem['content'] = PF('pDataSetName').jq.val().trim();
  newDataSetItem['title'] = PF('pDataSetName').jq.val().trim();
  if (newDataSetItem['start'] && newDataSetItem['end']
      && newDataSetItem['end'] > newDataSetItem['start']) {
    timeline.itemsData.getDataSet().add(newDataSetItem);
  }
  if (eventType == 'submit' && validData) {
    addDataSet();
  }
}

function validateNewDataSet() {

  var result = true;
  var errorString = null;
  const validCalibration = $('#uploadForm').data('validCalibration');

  // Check that there is a valid calibration for the selected start time
  if (!validCalibration) {
    errorString = $('#uploadForm').data('validCalibrationMessage');
  }

  // Check that there is a data set name
  if (newDataSetItem['content'].trim() == '') {
    errorString = 'Data set must have a name';
  }

  // Check the date range
  if (null == errorString) {
    if (null == newDataSetItem['start'] || null == newDataSetItem['end']) {
      errorString = 'Start and end date must be specified';
    }
  }

  if (null == errorString) {
    if (newDataSetItem['end'].getTime() <= newDataSetItem['start'].getTime()) {
      errorString = 'End must be after start date';
    }
  }

  // Check the data set name is unique
  if (null == errorString) {
    if (dataSetNameExists(newDataSetItem['content'])) {
      errorString = 'A data set with that name already exists';
    }
  }

  // Check that we don't overlap any other data sets
  if (null == errorString) {
    if (dataSetOverlaps(newDataSetItem['start'].getTime(),
        newDataSetItem['end'].getTime())) {
      errorString = 'Data set overlaps with existing data set';
    }
  }

  // Now make sure there's at least one file of each time within the data set range
  if (null == errorString) {
    if (!hasAllFiles(newDataSetItem['start'].getTime(), newDataSetItem['end'].getTime())) {
      errorString = 'Data set must contain concurrent data from all file types';
    }
  }

  if (null != errorString) {
    $('#errorList').html(errorString);
    $('#errorList').show();
    PF('pAddButton').disable();
    result = false;
  } else {
    $('#errorList').hide();
    PF('pAddButton').enable();
    result = true;
  }

  return result;
}

function dataSetNameExists(newName) {
  var result = false;

  for (var i = 0; i < dataSetNames.length; i++) {
    if (dataSetNames[i] == newName) {
      result = true;
      break;
    }
  }

  return result;
}

function dataSetOverlaps(newStart, newEnd) {

  var result = false;
  var ids = timeline.itemsData.getDataSet().getIds();

  // Data sets are at the end of the list, so go through it backwards
  for (var i = ids.length - 1; i > 0; i--) {

    // Ignore the new data set
    if (ids[i] != NEW_DATA_SET_ID) {

      var item = timeline.itemsData.getDataSet().get(ids[i]);
      if (item['type'] != 'background') {
        // We have finished the data sets, so stop
        break;
      } else {
        var itemStart = new Date(item['start']).getTime();
        var itemEnd = new Date(item['end']).getTime();

        var overlap = true;
        if (item['className'] == 'timelineNrtDataSet' ||
            itemEnd <= newStart || itemStart >= newEnd) {
          overlap = false;
        }

        if (overlap) {
          result = true;
          break;
        }
      }
    }
  }

  return result;
}

function hasAllFiles(newStart, newEnd) {

  var result = false;

  var group0Ids = timeline.itemsData.getDataSet().getIds({
    filter: function(item) {
      var accept = true;

      if (item['group'] != 0) {
        accept = false;
      } else if (new Date(item['start']).getTime() > newEnd || new Date(item['end']).getTime() < newStart) {
        accept = false;
      }

      return accept;
    }
  });

  // If we found IDs and there is only 1 group (excluding the dummy group), then we're done
  if (groups.length == 2 && group0Ids.length > 0) {
    result = true;
  } else {

    for (var i = 0; !result && i < group0Ids.length; i++) {

      var group0Item = timeline.itemsData.getDataSet().get(group0Ids[i]);
      var g0Start = new Date(group0Item['start']).getTime();
      var g0End = new Date(group0Item['end']).getTime();

      var allGroupsOK = true;
      for (var j = 2; allGroupsOK && j < groups.length; j++) {

        var groupIds = timeline.itemsData.getDataSet().getIds({
          filter: function(item) {
            var accept = true;

            if (item['group'] != j - 1) {
              accept = false;
            } else if (new Date(item['start']).getTime() > g0End || new Date(item['end']).getTime() < g0Start) {
              accept = false;
            }

            return accept;
          }
        });

        if (groupIds.length == 0) {
          allGroupsOK = false;
        }
      }

      if (allGroupsOK) {
        result = true;
      }
    }
  }

  return result;
}

function setRangeFromClick(date, datasets) {
  const data = datasets.get();
  var min = new Date(-8640000000000000);
  var max = new Date(8640000000000000);
  var max_file_date = new Date(-8640000000000000);
  var min_file_date = new Date(8640000000000000);
  var inside_existing = false;
  for (var i = 0; i < data.length; i++) {
    var start = data[i].start;
    var end = data[i].end;

    if (data[i].type == 'range') {
      if (start < min_file_date) {
        min_file_date = start;
      }
      if (end > max_file_date) {
        max_file_date = end;
      }
    }
    if (data[i].type == "background" && data[i].className == 'timelineDataSet'){
      if (start < date && date < end){
        inside_existing = true;
      }
      else {
        if (date < start && max > start) {
          max = new Date(start.getTime() - 1000)
        }
        if (date > end && min < end) {
          min = new Date(end.getTime() + 1000)
        }
      }
    }
  }
  if (min < min_file_date) {
    min = min_file_date
  }
  if (max > max_file_date) {
    max = max_file_date
  }
  if (!inside_existing) {
    setDateField('pStartDate', min);
    setDateField('pEndDate', max);
  }
  else {
    alert('You clicked on an area that already has a data set defined');
  }
}

// UGLY HACK ALERT!

// We get and set the dates in the PrimeFaces date pickers using Javascript,
// which means we get them all in the browser's local timezone instead of UTC.

// These functions get and set dates in the date pickers and hack the dates in and
// out of UTC to make them display as we want them.

function getDateField(name) {
  let date = PF(name).getDate();
  if (date) {
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
                    date.getHours(), date.getMinutes(), date.getSeconds()));
  }
  return date;
}

function setDateField(name, date) {
  let utcConversion = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
                               date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  PF(name).setDate(utcConversion);
}
