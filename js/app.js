/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {

        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {

    var model = {
      'init': function() {
        this.students = [{
          'name': 'Slappy the Frog'
        }, {
          'name': 'Lilly the Lizard'
        }, {
          'name': 'Paulrus the Walrus'
        }, {
          'name': 'Gregory the Goat'
        }, {
          'name': 'Adam the Anaconda'
        }];

        this.students.map(function(student) {
          var attendedClass;
          student.attendance = [];

          // push random attendance
          for (var i = 0; i <= 11; i++) {
            attendedClass = model.getRandomClassAttendance();
            student.attendance.push(attendedClass);
          }

          student.attendanceCount = student.attendance.reduce( (acc, currentValue) => {
            return acc + currentValue;
          });
        })
      },
      'getRandomClassAttendance': function () {
        return (Math.random() >= 0.5);
      }
    }

    var octopus = {
      'init': function() {
        model.init();
        daysView.init();
        studentView.init();
      },
      'updateModel': function(studentIndex, dayIndex, checked) {
        model.students[studentIndex].attendance[dayIndex] = checked;
        model.students[studentIndex].attendanceCount = checked ? model.students[studentIndex].attendanceCount + 1 : model.students[studentIndex].attendanceCount - 1;

      }
    }

    daysView = {
      'init': function() {
        for(var i = 12; i >= 1; i--) {
            var newDay = $('<th>' + i + '</th>');
            $('thead .name-col').after(newDay);
        }
      }
    }

    studentView = {
      'init': function() {
        var contentTable = $('tbody');

        model.students.forEach(function(student) {
          var studentRow = $("<tr></tr>");

          // append student name
          var studentNameCol = $("<td>" + student.name + "</td>").attr('class', 'name-col');
          studentRow.append(studentNameCol);

          // append days attendance
          student.attendance.forEach(function(attended) {
              var checked = attended ? " checked " : "";
              studentRow.append('<td><input type="checkbox"' + checked +'></td>').attr('class', 'attend-col');
          })

          // append last row
          var studentAttendanceCountCol = $('<td class="missed-col">0</td>');
          studentRow.append(studentAttendanceCountCol);

          contentTable.append(studentRow);
        });

        $('.attend-col').click(function() {
          var $this = $(this);
          var checked = $(this).is(':checked');

          octupus.updateModel($this.parent().index(), $this.index(), checked);

        })
      }
    }

    octopus.init();

    var attendance = JSON.parse(localStorage.attendance),
        $allMissed = $('tbody .missed-col'),
        $allCheckboxes = $('tbody input');

    // Count a student's missed days
    function countMissing() {
        $allMissed.each(function() {
            var studentRow = $(this).parent('tr'),
                dayChecks = $(studentRow).children('td').children('input'),
                numMissed = 0;

            dayChecks.each(function() {
                if (!$(this).prop('checked')) {
                    numMissed++;
                }
            });

            $(this).text(numMissed);
        });
    }

    // Check boxes, based on attendace records
    $.each(attendance, function(name, days) {
        var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
            dayChecks = $(studentRow).children('.attend-col').children('input');

        dayChecks.each(function(i) {
            $(this).prop('checked', days[i]);
        });
    });

    // When a checkbox is clicked, update localStorage
    $allCheckboxes.on('click', function() {
        var studentRows = $('tbody .student'),
            newAttendance = {};

        studentRows.each(function() {
            var name = $(this).children('.name-col').text(),
                $allCheckboxes = $(this).children('td').children('input');

            newAttendance[name] = [];

            $allCheckboxes.each(function() {
                newAttendance[name].push($(this).prop('checked'));
            });
        });

        countMissing();
        localStorage.attendance = JSON.stringify(newAttendance);
    });

    countMissing();
}());
