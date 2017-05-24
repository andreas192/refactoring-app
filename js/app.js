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
        this.setCurrentModel(studentIndex);
        model.currentStudent.attendance[dayIndex] = checked;
        model.currentStudent.attendanceCount = checked ? model.students[studentIndex].attendanceCount + 1 : model.students[studentIndex].attendanceCount - 1;
        studentView.refreshRow();
      },
      'setCurrentModel': function(studentIndex) {
        model.currentStudent = model.students[studentIndex];
        model.currentStudentIndex = studentIndex;
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
          var studentRow = studentView.renderRow(student);

          contentTable.append(studentRow);
        });

        $('tr').on('click', '[type="checkbox"]', function() {
          var $this = $(this);
          var checked = $(this).is(':checked');

          octopus.updateModel($this.closest('tr').index(), $this.parent().index() - 1, checked);

        })
      },
      'refreshRow': function (student) {
          var studentRow = this.renderRow();
      },
      'renderRow': function(student) {
        var studentRow = model.currentStudent ? $('tr').eq(model.currentStudentIndex + 1) : $("<tr></tr>");
        var student = student ? student : model.currentStudent;
        
        studentRow.html('');
        
        // append student name
        var studentNameCol = $("<td>" + student.name + "</td>").attr('class', 'name-col');
        studentRow.append(studentNameCol);

        // append days attendance
        student.attendance.forEach(function(attended) {
            var checked = attended ? " checked " : "";
            studentRow.append('<td><input type="checkbox"' + checked +'></td>').attr('class', 'attend-col');
        })

        // append last row
        var studentAttendanceCountCol = $('<td class="missed-col">' + student.attendanceCount + '</td>');
        studentRow.append(studentAttendanceCountCol);

        return studentRow;
      }
    }

    octopus.init();
}());
