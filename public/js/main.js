//Getting all elements as variables
var rotate_btn = document.getElementsByClassName('rotate_btn')
var submit_angle = document.getElementById('submit_angle');
var rotate_input = document.getElementById('rotate_value');
var submit_scale_percent = document.getElementById('submit_scale_percent');
var scale_percent_input = document.getElementById('scale_percent_value');
var scale_width_input = document.getElementById('scale_width_value')
var scale_height_input = document.getElementById('scale_height_value')
var scale_submit = document.getElementById('scale_submit')
var aspect_ratio_check = document.getElementById('aspect_ratio_check')
var text_input = document.getElementById('text_input');
var text_submit = document.getElementById('text_submit');
var undo_btn = document.getElementById('undo');
var redo_btn = document.getElementById('redo');
var modal = document.getElementById('myModal');
var span_close = document.getElementsByClassName("close")[0];
var imageSaver = document.getElementById('imageSaver');
var imageDownloader = document.getElementById('imageDownload');
var historyArr = document.getElementById('history_big_data').innerHTML;


//Initialising canvas
canvas = new fabric.Canvas('c');
canvas.setBackgroundImage('/images/backshirt2.jpg', canvas.renderAll.bind(canvas));

//Setting image loader
document.getElementById('Load_image').onchange = function handleImage(e) {
  var reader = new FileReader();
  reader.onload = function(event) {
    var image_object = new Image();
    image_object.src = event.target.result;
    image_object.onload = function() {
      var image = new fabric.Image(image_object);
      image.scaleToWidth(200);
      image.set({
        angle: 0,
        left: 305,
        top: 120
      });
      canvas.add(image);
      image.centerH()
      image.sendToBack();
      canvas.renderAll();
      updateState(true);
    }
  }
  reader.readAsDataURL(e.target.files[0]);
}

//Event Listener to add Text Object to canvas
add_text.addEventListener('click', function() {
  var text = new fabric.IText('Double tap here to type', {
    fontSize: 23,
    left: 292,
    top: 300
  });
  canvas.add(text)
  text.centerH()
  updateState(true);
});

//Event listener when any object is selected
canvas.on('object:selected', function() {
  if (canvas.getActiveObject().text) {
    scale_width_input.value = '';
    scale_height_input.value = '';
  } else {
    scale_width_input.value = Math.floor(canvas.getActiveObject().getWidth());
    scale_height_input.value = Math.floor(canvas.getActiveObject().getHeight());
  }
});

//Event listener when any object is added
canvas.on('object:added', function(e) {
  var object = e.target;
  canvas.setActiveObject(object);
});

//Event listener when any object is modified
canvas.on('object:modified', function() {
  updateState(true);
});

//Event Listener when any object is scaling
canvas.on('object:scaling', function(e) {
  var scaledObject = e.target;
  if (!canvas.getActiveObject().text) {
    aspect_ratio_check.checked = false;
    scale_width_input.value = Math.floor(scaledObject.getWidth());
    scale_height_input.value = Math.floor(scaledObject.getHeight());
  }
});

//Event listener when any object is rotating
canvas.on('object:rotating', function(e) {
  var rotatingObject = e.target;
  if (rotatingObject.getAngle() > 360)
    rotate_input.value = Math.floor(rotatingObject.getAngle() - 360);
  else
    rotate_input.value = Math.floor(rotatingObject.getAngle());
});

//Function to Rotate a selected object
function rotate(angle_to_rotate) {
  if (!canvas._activeObject) {
    pop_up('Please select a object to rotate', 'error');
    return;
  }
  var current_angle = parseInt(canvas._activeObject.getAngle());
  var new_angle = parseInt(angle_to_rotate);
  canvas._activeObject.setAngle(current_angle + new_angle);
  canvas.renderAll();
  canvas.trigger('object:modified');
}

//Event Handler for Rotating a selected object
submit_angle.addEventListener('click', function() {
  if (rotate_input.value == '') {
    pop_up('Please enter a value in degrees to rotate (examples: 45 or 90..)', 'error');
    return;
  }
  if (isInt(rotate_input.value)) {
    rotate(rotate_input.value);
  } else {
    pop_up('Please enter integers only to rotate (examples: 45 or 90..)', 'error');
    return;
  }
});

//Function to change height value proportionate to width input when aspect ratio is checked
scale_width_input.addEventListener('input', function() {
  if (canvas._activeObject && !canvas._activeObject.text) {
    if (aspect_ratio_check.checked == true) {
      var size_scale = canvas._activeObject.getWidth() / canvas._activeObject.getHeight();
      var entered_width = scale_width_input.value;
      var required_height = entered_width / size_scale;
      scale_height_input.value = Math.floor(required_height);
    }
  }
});

//Function to change width value proportionate to height input when aspect ratio is checked
scale_height_input.addEventListener('input', function() {
  if (canvas._activeObject && !canvas._activeObject.text) {
    if (aspect_ratio_check.checked == true) {
      var size_scale = canvas._activeObject.getHeight() / canvas._activeObject.getWidth();
      var entered_height = scale_height_input.value;
      var required_width = entered_height / size_scale;
      scale_width_input.value = Math.floor(required_width);
    }
  }
});

//Event Handler for scaling a image object on dimentions input
scale_submit.addEventListener('click', function() {
  if (!canvas._activeObject) {
    pop_up('Please select a object to scale', 'error');
    return;
  }
  if (canvas._activeObject.text) {
    pop_up('Please scale text boxes only by below buttons', 'error');
    return;
  } else {
    if (scale_width_input.value == '' || scale_height_input.value == '') {
      pop_up('Please enter both width and height to scale', 'error');
      return;
    }
    if (isInt(scale_width_input.value) && isInt(scale_height_input.value)) {
      if (scale_width_input.value > 0 && scale_height_input.value > 0) {
        canvas._activeObject.setWidth(Math.floor(scale_width_input.value / canvas._activeObject.scaleX));
        canvas._activeObject.setHeight(Math.floor(scale_height_input.value / canvas._activeObject.scaleX));
        canvas.renderAll();
        canvas.trigger('object:modified');
      } else {
        pop_up('Please enter only positive integers as width or height', 'error');
        return;
      }
    } else {
      pop_up('Please enter only positive integers as width or height', 'error');
      return;
    }
  }
});

//Event Handler to Scale a image object by percentage
submit_scale_percent.addEventListener('click', function() {
  if (!canvas._activeObject) {
    pop_up('Please select a object to scale', 'error');
    return;
  }
  if (!canvas._activeObject.text) {
    if (isInt(scale_percent_input.value)) {
      if (scale_percent_input.value > 0 && scale_percent_input.value <= 1000) {
        var current_width = Math.floor(canvas._activeObject.getWidth());
        scale_height_input.value = current_width;
        var required_percent = parseInt(scale_percent_input.value);
        canvas._activeObject.scaleToWidth(current_width * required_percent / 100);
        scale_width_input.value = Math.floor(canvas._activeObject.getWidth())
        scale_height_input.value = Math.floor(canvas._activeObject.getHeight())
        canvas.renderAll();
        canvas.trigger('object:modified');
      } else {
        pop_up('Please enter positive percentage from 0 to 1000 only to scale', 'error');
        return;
      }
    } else {
      pop_up('Please enter positive numbers only to scale (example: 50)', 'error');
      return;
    }
  } else {
    pop_up('Please scale text boxes only by below buttons', 'error');
    return;
  }
});

//Function to Scale Text Object by buttons
function resize_textbox(val) {
  if (!canvas._activeObject) {
    pop_up('Please select a object to scale', 'error');
    return;
  }
  if (canvas._activeObject.text) {
    var old_size = canvas._activeObject.getFontSize();
    canvas._activeObject.setFontSize(val + old_size);
    canvas.renderAll();
    canvas.trigger('object:modified');
  } else {
    pop_up('Please use percentage or dimentions to scale images', 'error');
    return;
  }
}

// Initialising state and modifications for undo and redo functionality
var state = [];
var mods = 0;

//Function to updatestate for undo and redo functionality
function updateState(save) {
  if (save === true) {
    canvas_json = JSON.stringify(canvas);
    state.push(canvas_json);
  }
}

//Event listener and function for handling undo functionality
undo_btn.addEventListener('click', function() {
  if (mods == state.length - 1) {
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().remove();
      return
    }
  }
  if (mods < state.length) {
    canvas.loadFromJSON(state[state.length - 1 - mods - 1]);
    canvas.renderAll();
    mods += 1;
  }
});

//Event listener and function for handling redo functionality
redo_btn.addEventListener('click', function() {
  if (mods > 0) {
    canvas.loadFromJSON(state[state.length - 1 - mods + 1]);
    canvas.renderAll();
    mods -= 1;
  }
});

//Event Listener to remove selected object
remove_object.addEventListener('click', function() {
  if (canvas.getActiveObject()) {
    updateState(true);
    canvas.getActiveObject().remove();
  } else {
    pop_up('Please select a item to remove from canvas', 'error');
    return
  }
});

//Set create new design as default open tab
document.getElementById("defaultOpen").click();

//function for switching tabs
function openTab(evt, design_type) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", " ");
  }
  document.getElementById(design_type).style.display = "block";
  evt.currentTarget.className += " active";
}

//Function for customising and showing pop up
function pop_up(msg, type) {
  if (type == 'error') {
    document.getElementById('modal-matter').innerHTML = '<i class="fa fa-times" aria-hidden="true"></i> ' + msg;
    document.getElementById('modal-matter').style.color = '#cb202d';
  } else {
    document.getElementById('modal-matter').innerHTML = '<i class="fa fa-check" aria-hidden="true"></i> ' + msg;
    document.getElementById('modal-matter').style.color = 'green';
  }
  modal.style.display = "block";
}

//Close modal on click of close button
span_close.addEventListener('click', function() {
  modal.style.display = "none";
});

//Close modal on click of else where on window
window.addEventListener('click', function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

//function to know if input is Integer
function isInt(value) {
  return !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10));
}

//function to know if pressed key is a number
function isNumber(evt) {
  evt = (evt) ? evt : window.event;
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

//Event listener and function to save canvas as json to database
imageSaver.addEventListener('click', saveImage, false);
function saveImage(e) {
  var final = JSON.stringify(canvas.toDatalessJSON())
  function postAjax(url, data) {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
      if (xhr.readyState > 3 && xhr.status == 200) {
        pop_up(xhr.responseText, 'success');
      }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
    return xhr;
  }
  if (canvas.getObjects().length > 0)
    postAjax('/', 'item=' + final);
  else
    pop_up('Please add some design and then save it', 'error');

};

//Event listener to download the canvas as jpeg image
imageDownloader.addEventListener('click', imageDownload, false);
function imageDownload(e) {
  this.href = canvas.toDataURL({
    format: 'jpeg',
    quality: 0.8
  });
  this.download = 'Your_Awesome_Design.jpg'
}

//Function to load canvas from selected history
function UpdateCanvas(his_val) {
  var hisval = parseInt(his_val.split(' ').pop() - 1);
  var hisObj = JSON.parse(historyArr)
  var babe = JSON.parse(hisObj[hisval]);
  var babe2 = babe.objects
  for (var car in babe2) {
    if (babe2[car].src)
      babe2[car].src = babe2[car].src.replace(/ /g, "+")
  }
  canvas.loadFromJSON(babe, canvas.renderAll.bind(canvas), function(o, object) {
    console.log(object)
  });
  state.length = 0;
  mods = 0;
}

// //Function to load canvas from selected history using ajax
// function UpdateCanvas(his_val) {
//   var hisval = parseInt(his_val.split(' ').pop() - 1);
//   var xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//       var historyArr = this.responseText;
//       hisObj = JSON.parse(historyArr)
//       var babe = JSON.parse(hisObj[hisval]);
//       var babe2 = babe.objects
//       for (var car in babe2) {
//         if (babe2[car].src)
//           babe2[car].src = babe2[car].src.replace(/ /g, "+")
//       }
//       canvas.loadFromJSON(babe, canvas.renderAll.bind(canvas), function(o, object) {
//         console.log(object)
//       });
//     }
//   };
//   xhttp.open("GET", "/history", true);
//   xhttp.send();
// }
