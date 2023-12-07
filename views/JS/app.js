//The URIs of the REST endpoint
CREATE_ONE = "https://prod-25.ukwest.logic.azure.com/workflows/339b587c67654bf39a8a26a9ff13c552/triggers/manual/paths/invoke/rest/v1/media/{isImage}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Api-H1cYKTjLMM5ezqUhxDDpQJXPge0ErBELt0wElI0";
READ_ALL = "https://prod-13.ukwest.logic.azure.com/workflows/a9fb205e59814c5c9c1d435df2c3f852/triggers/manual/paths/invoke/rest/v1/media?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_BHqXu3GLklCsKNBx5K_2No3TOpuLFhTqM5Hq45PMw4";
READ_ONE = "https://prod-54.eastus.logic.azure.com/workflows/86b26d329f8e494c9410c0eecd28ef8b/triggers/manual/paths/invoke/rest/v1/media/{id}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=aJI0oDoJ0GP4pCoGn_vc2oeqTGAr8Tl3JL5M1j-ILTg"
UPDATE_MEDIA = "https://prod-52.eastus.logic.azure.com/workflows/61c5175e173147a3af23dc1f9302877c/triggers/manual/paths/invoke/rest/v1/media/{id}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=dtOcFB_XV8raqh3Q52XO5TNLr_XU6UGltSp9sDNaQtg"
DELETE_MEDIA = "https://prod-07.ukwest.logic.azure.com/workflows/5d90b3b5666c4c4389339d53f7171b8a/triggers/manual/paths/invoke/rest/v1/media/{id}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=bQ0TGCvwvxw5rNdOJ3xh6-HhBfn8s9Yiho2dXuyLWBA"
USER_LOGIN = "https://prod-27.ukwest.logic.azure.com/workflows/9d225acda29a44acb562ac5bbd86b769/triggers/manual/paths/invoke/rest/v1/users/login?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zp7JD_BFrkyYErDKRtycBYBKCVCbcctAAxyGZcgGR3E"
USER_CREATE = "https://prod-92.eastus.logic.azure.com/workflows/78b7f5b3802a483f896908e6b1a5f349/triggers/manual/paths/invoke/rest/v1/users/create?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=jMf0uOg_9xOjHXku8FiJD63bkzUfSFfXqbmf2LkhUcw"
GET_USER_MEDIA = "https://prod-03.ukwest.logic.azure.com/workflows/75ed506e0173406f94c2443801b948c9/triggers/manual/paths/invoke/rest/v1/users/{id}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0MTYoEAZjebKD86jsDGzQ8jWLkNVS24DegZ0oVoyalo";
TRANSLATE = "https://api.cognitive.microsofttranslator.com/translate?";
BLOB_ACCOUNT = "https://alfieb.blob.core.windows.net";

current_location = window.location.pathname;
activeTab = "";
imgType = ['png','jpg','gif','tiff'];
languages = new Map([
  ["en", "English"],
  ["fr", "French"],
  ["es", "Spanish"],
  ["de", "German"],
  ["it", "Italian"]
]);


$(document).ready(function() {
  setUpPages();

  $("#subNewForm").click(function(){
    submitNewItem();
    this.innerHTML = '<div class="spinner-border" role="status" style="margin: auto;"><span class="sr-only">&nbsp;</span>';
  }); 

  $("#getOne").click(function(){
    getOneItem("#ItemList", $('#mediaID').val());
  });

  $("#createUser").click(function(){
    createUser();
    this.innerHTML = '<div class="spinner-border" role="status" style="margin: auto;"><span class="sr-only">&nbsp;</span>';
  });

  $("#loginUser").click(function(){
    loginUser();
    this.innerHTML = '<div class="spinner-border" role="status" style="margin: auto;"><span class="sr-only">&nbsp;</span>';
  });
  
  $("#uploadMedia").click(function(){
    $("#newAssetForm").show();
  });

  $("#subUpdateForm").click(function(){
    updateItem(sessionStorage.getItem("userItemID"));
  });

  $("#userLogout").click(function(){
    sessionStorage.clear();
    window.location.href = "index.html";
  });
});

function submitNewItem(){
  isImage = (imgType.includes($("#UpFile")[0].files[0].name.split('.')[1])) ? '1': '0';
  submitURI = CREATE_ONE.replace('{isImage}', isImage);
  submitData = new FormData();
  submitData.append('FileName', $("#UpFile")[0].files[0].name);
  submitData.append('userID', sessionStorage.getItem("current_user_id"));
  submitData.append('userName', sessionStorage.getItem("current_user_name"));
  submitData.append('File', $("#UpFile")[0].files[0]);

  $.ajax({
    url: submitURI,
    data: submitData,
    cache: false,
    enctype: 'multipart/form-data',
    contentType: false,
    processData: false,
    type: 'POST',
    success: function(data){
      getUserItems();
      $("#subNewForm").empty();
      $("#subNewForm").append("Submit");
    }
  });
}

function getItems(){
  $('#ItemList').html('<div class="spinner-border" role="status" style="margin: auto;"><span class="sr-only">&nbsp;</span>');
  $.getJSON(READ_ALL, function( data ) {

    var items = [];
    counter = 0;
    $.each( data, function( key, val ) {
      if (counter === 0){
        items.push("<div class='row'>")
      };
      items.push("<div class='col-4 mediaItem'>")
      if (imgType.includes(val['fileName'].split('.')[1])) {
        items.push("<img id='" + val["id"] + "' src='"+ BLOB_ACCOUNT + val["filePath"] +"' style='width: 75%; height: auto;'/><br/><br/>")
      }
      else {
        items.push("<video controls style='width: 75%; height: auto;><source id='" + val["id"] + "' src='"+ BLOB_ACCOUNT + val["filePath"] +"'/></video><br/><br/>")
      }
      items.push( "<span>File: " + val["fileName"] + "</span>");
      items.push( "<button id='copyId_" + val["id"] + "' class='btn btn-sm btn-info' style='margin-left: 10px;'>Copy Media ID</button>");
      items.push( "<br/><span>Uploaded by: " + val["userName"] + " (user id: "+val["userID"]+")</span>");
      items.push("</div>")
      counter ++;
      if (counter === 3){
        items.push("</div class='row'> <hr/>")
        counter = 0;
      };
    });
    $('#ItemList').empty();
    $("#ItemList").append(items.join( "" ));

    $("[id^=copyId_]").click(function(){
      thisItemID = this.id.split('copyId_')[1];
      navigator.clipboard.writeText(thisItemID);
      this.innerHTML = "Copied!";
    });

    if(sessionStorage.getItem("targetLang") != ""){
      $(document).ready(function() {translatePage();})
    }
  });

}

function getUserItems(){
  $('#userMediaList').html('<div class="spinner-border" role="status" style="margin: auto;"><span class="sr-only">&nbsp;</span>');
  targetURI = GET_USER_MEDIA.replace("{id}", sessionStorage.getItem("current_user_id"));
  $.getJSON(targetURI, function( data ) {
    var items = [];
    counter = 0;
    $.each( data, function( key, val ) {
      if (counter === 0){
        items.push("<div class='row'>")
      };
      items.push("<div class='col-4 mediaItem'>")
      if (imgType.includes(val['fileName'].split('.')[1])) {
        items.push("<img id='" + val["id"] + "' src='"+ BLOB_ACCOUNT + val["filePath"] +"' style='width: 75%; height: auto;'/><br/><br/>")
      }
      else {
        items.push("<video controls style='width: 75%; height: auto;><source id='" + val["id"] + "' src='"+ BLOB_ACCOUNT + val["filePath"] +"'/></video><br/><br/>")
      }
      items.push( "<span>File: " + val["fileName"] +"</span>");
      items.push( "<button id='copyId_" + val["id"] + "' class='btn btn-sm btn-info' style='margin-left: 10px;'>Copy Media ID</button><br/>");
      items.push( "<button class='btn btn-danger' style='margin-right:10px; margin-top: 10px;' id='deleteItem"+val["id"] + "'>Delete</button>");
      items.push( "<button class='btn btn-primary' style='margin-top: 10px;' id='updateItem"+val["id"] + "'>Update</button><br />");
      items.push("</div>")
      counter ++;
      if (counter === 3){
        items.push("</div class='row'> <hr/>")
        counter = 0;
      };
    });
    $('#userMediaList').empty();
    $( "<ul/>", {"class": "user-item-list", html: items.join( "" )}).appendTo( "#userMediaList" );

    $("[id^=deleteItem]").click(function(){
      userItemID = this.id.split('deleteItem')[1];
      deleteItem(userItemID);
      getUserItems();
    });

    $("[id^=updateItem]").click(function(){
      userItemID = this.id.split('updateItem')[1];
      sessionStorage.setItem("userItemID", userItemID);
      window.location.href = "update.html";
    });  

    $("[id^=copyId_]").click(function(){
      thisItemID = this.id.split('copyId_')[1];
      navigator.clipboard.writeText(thisItemID);
      this.innerHTML = "Copied!";
    });

    if(sessionStorage.getItem("targetLang") != ""){
      $(document).ready(function() {translatePage();})
    }
  });
}

function updateItem(itemID){
  updateURI = UPDATE_MEDIA.replace("{id}", itemID);
  submitData = new FormData();
  submitData.append('FileName', $("#UpFile")[0].files[0].name);
  submitData.append('userID', sessionStorage.getItem("current_user_id"));
  submitData.append('userName', sessionStorage.getItem("current_user_name"));
  submitData.append('File', $("#UpFile")[0].files[0]);

  $.ajax({
    url: updateURI,
    data: submitData,
    cache: false,
    enctype: 'multipart/form-data',
    contentType: false,
    processData: false,
    type: 'PUT',
    success: function(data){
      window.location.href = "userMedia.html";
      sessionStorage.setItem("userItemID", null);
    }
  });
}

function deleteItem(itemID){
  deleteURI = DELETE_MEDIA.replace("{id}", itemID)
  $.ajax({
    url: deleteURI,
    cache: false,
    contentType: false,
    processData: false,
    type: 'DELETE',
    success: function(data){}
  }).done(function( msg ) {
    getUserItems();
  });
}

function getOneItem(target, itemID){
  $(target).html('<div class="spinner-border" role="status"><span class="sr-only">&nbsp;</span>');
  htmlStr = "<div class='row'>"
  $.getJSON(READ_ONE.replace("{id}", itemID), function( data, val ) {
    if (imgType.includes(data['fileName'].split('.')[1])) {
      htmlStr = htmlStr + "<img id='" + data["id"] + "' src='"+ BLOB_ACCOUNT + data["filePath"] +"' style='width: 50%; height: auto;'/></div>";
    }
    else {
      htmlStr = htmlStr + "<video controls style='width: 50%; height: auto;><source id='" + data["id"] + "' src='"+ BLOB_ACCOUNT + data["filePath"] +"'/></video></div>";
    }
    htmlStr = htmlStr +"\n\n<br/><br/><div class='row'>File : " + data["fileName"] + "</div><br/>";
    $(target).empty();
    $(target).append(htmlStr);
  })
}

function loginUser(){
  submitData = new FormData();
  submitData.append('userName', $('#uname').val());
  submitData.append('password', CryptoJS.MD5($("#psw").val()));

  $.ajax({
    url: USER_LOGIN,
    data: submitData,
    cache: false,
    enctype: 'multipart/form-data',
    contentType: false,
    processData: false,
    type: 'POST',
    success: function(data){
      sessionStorage.setItem("current_user_id", data["userID"]);
      sessionStorage.setItem("current_user_name", $('#uname').val());
      window.location.href = "userMedia.html";
    }
  });
}

function createUser(){
  submitData = new FormData();
  userId = Math.floor(Math.random() * 1000000);
  submitData.append('userName', $('#uname').val());
  submitData.append('password', CryptoJS.MD5($("#psw").val()));
  submitData.append('admin', 0);
  submitData.append('userId', userId);

  $.ajax({
    url: USER_CREATE,
    data: submitData,
    cache: false,
    enctype: 'multipart/form-data',
    contentType: false,
    processData: false,
    type: 'POST',
    success: function(data){
      sessionStorage.setItem("current_user_id", userId);
      sessionStorage.setItem("current_user_name", $('#uname').val());
      window.location.href = "userMedia.html";
    }
  });
}

function locationSpecific(){
  if(current_location.includes("userMedia")){
    if(sessionStorage.getItem("current_user_name") === null) window.location.href = "/";
      activeTab = "user-link";
      userInfo = "<p><b>Username:</b> " + sessionStorage.getItem("current_user_name") + "<br/><b>User ID:</b> " + sessionStorage.getItem("current_user_id") + "</p>";
      $("#userInfo").append(userInfo);
      getUserItems();
  }
  if(current_location.includes("update")){
    activeTab = "user-link";
      getOneItem("#UpdateMediaDetails", sessionStorage.getItem("userItemID"));
      if(sessionStorage.getItem("targetLang") != null){
        translatePage();
      }
  }
  if(current_location == "/" || current_location.includes("index")){
    activeTab = "home-link";
      getItems();
  }
  if(current_location.includes("login")){
    activeTab = "user-link";
    if(sessionStorage.getItem("targetLang") != null){
      translatePage();
    }
  }
  if(current_location.includes("createUser")){
    activeTab = "user-link";
    if(sessionStorage.getItem("targetLang") != null){
      translatePage();
    }
  }
}

function translatePage() {
  targetLang = sessionStorage.getItem("targetLang");
  translateuri = TRANSLATE + "api-version=3.0&to=" + targetLang;
  allElements = $("body *");
  textToTranslate = "";
  elements = [];
  for (element of allElements) {
    if(!element.innerHTML.includes("<") && element.innerHTML != "&nbsp;" && !element.innerHTML == "") {
      textToTranslate = textToTranslate + element.innerHTML + " -- ";
      elements.push(element);
    }
  }
  textToTranslate = textToTranslate.substring(0, textToTranslate.length - 4);
  toSend = {"text" : textToTranslate};

  $.ajax({
      url: translateuri,
      headers: {"Ocp-Apim-Subscription-Key" : "262534ba392244ab8139b2f9685d0bbd",
                "Ocp-Apim-Subscription-Region" : "uksouth"},
      data: "[" + JSON.stringify(toSend) + "]",
      contentType: 'application/json',
      type: 'POST',
      success: function(data){
        translatedText = data[0]['translations'][0]['text'];
        translatedWords = translatedText.split(" -- ");

        for ([index, word] of translatedWords.entries()) {
          $(elements[index]).empty().append(word);
        }
      }
    });
}

function setUpPages() {
  if(sessionStorage.getItem("current_user_name") != null){
    $("#uNameText").append(sessionStorage.getItem("current_user_name"));
    $('#user-link').show();
  }
  else {
    loginButton = "<a id='loginRedirect' href='login.html' class='d-flex align-items-center text-white text-decoration-none'>Login</a>"
    $("#loginZone").empty();
    $("#loginZone").append(loginButton);
  }
  if(sessionStorage.getItem("targetLang") === null) {
    sessionStorage.setItem("targetLang", "");
  }
  if(sessionStorage.getItem("targetLang") != ""){
    $("#langText").empty().append(languages.get(sessionStorage.getItem("targetLang")));
  }
  else {
    $("#langText").empty().append("English");
  }

  for([key, value] of languages) {
    $("#lang-links").append('<li><a id="langId_'+key+'" class="dropdown-item">'+value+'</a></li>')
  }
  locationSpecific();
  $("#" + activeTab).addClass("active");

  $("[id^=langId_]").click(function(){
    langId = this.id.split('langId_')[1];
    if(langId != "en") {
      sessionStorage.setItem("targetLang", langId);
    }
    else {
      sessionStorage.setItem("targetLang", "");
    };
    location.reload();
  });
}