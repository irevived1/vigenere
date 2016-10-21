var original;
var modtext = '';

function get_select() {
  return $('option').filter(':selected').val();
}

function get_largetext() {
  original =  $('#largetext').val();
}

function get_input() {
  return $('#key').val();
}

function addListener() {
  $('select').on('change',function (e) {
    if (get_select() == 'Encrypt') {
      $('#key').hide();
      $('#key').animate({ "height": "toggle", "opacity": "toggle" });
    } else {
      $('#key').show();
      $('#key').animate({ "height": "toggle", "opacity": "toggle" });
    }
  });

  $('#go').on('click', function (e) {
    e.preventDefault();
    if (get_select() == 'Encrypt') {
      if (get_input() == '' || get_largetext() == '' ) {
        alert('Fields cannot be blank!');
        return;
      }
      var tmp  = encrypt(cleanString(),get_input().toUpperCase(),1);
      // $('#textbox').prepend(`<div class='tbx'><textarea disabled style="width:100%;font-size:0.8em;" rows="8" name="INPUT">${tmp}</textarea></div>`);
      $('#textbox').prepend(`<div class='tbx'><textarea disabled style="font-size:0.8em;" rows="16" cols="80" name="INPUT">${tmp}</textarea></div>`);
    $('.tbx').first().hide();
    $('.tbx').first().animate({ "height": "toggle", "opacity": "toggle" });
    setTimeout(removePrevBox, 700)
    } else {
      get_largetext();
      var cleaned = cleanString();
      // var guessedKey = decipher(original);
      var guessedKey = decipher(cleaned);
      var tmp  = encrypt(cleaned,guessedKey,-1);
      // $('#textbox').prepend(`<div class='tbx'>I think your key is "${guessedKey}"<br /><textarea disabled style="width:100%;font-size:0.8em;" rows="8" name="INPUT">${tmp}</textarea></div>`);
      $('#textbox').prepend(`<div class='tbx'>I think your key is "${guessedKey}"<br /><textarea disabled style="font-size:0.8em;" rows="16" cols="80" name="INPUT">${tmp}</textarea></div>`);
    $('.tbx').first().hide();
    $('.tbx').first().animate({ "height": "toggle", "opacity": "toggle" });
    setTimeout(removePrevBox, 700)
    }
  });
}

function decipher(string) {
  //most frequently used letter in english
  var keylength = getKeyLength(string);
  return keyGenerator(string,keylength);
}

function keyGenerator(string,keylength) {
  var guessyourkey = '';
  var possibleE = new Array(keylength);
  var arr = Array(keylength).join(".").split(".");
  for (var i = 0, len = string.length; i < len; i++) {
    arr[i%keylength] += string[i];
  }
  for (var i = 0, len = keylength; i < len; i++) {
    possibleE[i] = getMostFreq(arr[i]);
    //4 is E in alphabetical order, assuming A is 0;
    let l = (possibleE[i] + 26  - 4 )%26;
    guessyourkey += String.fromCharCode(65 + l);
  }
  return guessyourkey;
}

function getMostFreq(string) {
  //26 letters
  var arr = new Array(26).fill(0);
  for (var i = 0, len = string.length; i < len; i++) {
    arr[string[i].charCodeAt(0)-65]++;
  }
  return findMax(arr);
}

function findMax(arr) {
  var maxIndex = 0;
  for (var i = 0, len = arr.length; i < len; i++) {
    if (arr[maxIndex] < arr[i]) {
      maxIndex = i;
    }
  }
  return maxIndex;
}

function getKeyLength(string) {
  const six = 0.066;
  var arr = new Array(50);
  var len = string.length;
  for (var i = 0, le = arr.length; i < le; i++) {
    var coinci = 0;
    for (var j = 0 ; j <  len ; j++) {
      // if (string[j].match(/[A-Z]/) && string[(i+j)%len] == string[j] ) {
      if ( string[(i+1+j)%len] == string[j] ) {
        coinci++;
      }
    }
    arr[i] = coinci/len;
  }
  var deviation = new Array(50);
  for (var i = 0, len = deviation.length; i < len; i++) {
    deviation[i] = Math.abs(arr[i]-six);
  }
  for (var i = 0, len = deviation.length; i < len; i++) {
    if (Math.abs(deviation[i]) < 0.01 ) {
      return i+1;
    }
  }

  // var index_of_smallest = get_two_min(deviation);
  // if ( Math.abs(deviation[index_of_smallest[0]] - deviation[index_of_smallest[1]]) > 0.01 ) {
  //   return index_of_smallest[0];
  // } else {
  //   return gcd(index_of_smallest[0],index_of_smallest[1]);
  // }
}

function gcd(a, b) {
    if ( b == 0) {
        return a;
    }
    return gcd(b, a % b);
};

function get_two_min(array) {
  var holder = [];
  var min = 0;
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[min] > array[i]){
      min = i;
    }
  }
  holder.push(min+1);
  var min2 = min == 0 ? 1 : 0;
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[min2] > array[i] && min != i ){
      min2 = i;
    }
  }
  holder.push(min2+1);
  return holder;
}

function removePrevBox() {
  $('.tbx').last().animate({ "height": "toggle", "opacity": "toggle" },700,function(){ $('.tbx').last().remove();});
}

function cleanString() {
  original = original.toUpperCase();
  return original.replace(/[^A-Z]/g,"");
}

function encrypt(string,key,n) {
  grinder(string,key,n);
  var tmp = '';
  var counter = 0;
  for (var i = 0, len = original.length; i < len; i++) {
    if (original[i].match(/[A-Z]/)) {
      tmp += modtext[counter++];
    } else {
      tmp += original[i];
    }
  }
  return tmp;
}

//no space;
function grinder(text,key,n) {
  // if n = -1 is to decrypt, 1 to encrypt
  var klength = key.length;
  var ret = '';
  for (var i = 0, len = text.length; i < len; i++) {
    let l =  (text[i].charCodeAt(0) + (n*(key[i%klength]).charCodeAt(0))+26)%26;
    ret += String.fromCharCode(65 + l);
  }
  modtext = ret;
  return ret;
}

$(function () {
  addListener();
});
