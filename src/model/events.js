if (!global.db) {
    const pgp = require('pg-promise')();
    db = pgp(process.env.DB_URL);
}
//const fs = require('fs');
//const uuid = require('uuid/v4');
const moment = require('moment');

function list(userId = '') {
    const sql = `
        SELECT *
        FROM events
        WHERE "userId" = $1
        ORDER BY "startTs" ASC
    `;
    return db.any(sql, userId);
}

function create(userId, location, lng, lat, startTs, endTs, allDay, title, decription, lable, trans) {
    const sql = `
        INSERT INTO events ("userId", "location", "lng", "lat", "startTs", "endTs", "startYear", "startMonth", "startDay", "endYear", "endMonth", "endDay", "allDay", "title", "decription", "lable", "trans")
        VALUES(
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        EXTRACT(YEAR FROM TIMESTAMP $5),
        EXTRACT(MONTH FROM TIMESTAMP $5),
        EXTRACT(DAY FROM TIMESTAMP $5),
        EXTRACT(YEAR FROM TIMESTAMP $6),
        EXTRACT(MONTH FROM TIMESTAMP $6),
        EXTRACT(DAY FROM TIMESTAMP $6),
        $7,
        $8,
        $9,
        $10,
        $11)
        RETURNING *
    `;
    return db.one(sql, [userId, location, lng, lat, startTs, endTs, allDay, title, decription, lable, trans]);
}

function accesstoken() {
  return new Promise((resolve, reject) => {
    resolve(JSON.parse('{"token": "pk.eyJ1IjoidHJrdWFuIiwiYSI6ImNqMXlsYnE1ZjAwdHcyeHJxa3lrYWg2dHcifQ.tBkscd-d-S0Z374VcVw3Qg"}'));
  });
}

function modify(eventId, userId, location, lng, lat, startTs, endTs, allDay, title, decription, lable, trans) {
    const sql = `
        UPDATE events
        SET "location" = $3,
        "lng" = $4,
        "lat" = $5,
        "startTs" = $6,
        "endTs" = $7,
        "startYear" = EXTRACT(YEAR FROM TIMESTAMP $6),
        "startMonth" = EXTRACT(MONTH FROM TIMESTAMP $6),
        "startDay" = EXTRACT(DAY FROM TIMESTAMP $6),
        "endYear" = EXTRACT(YEAR FROM TIMESTAMP $7),
        "endMonth" = EXTRACT(MONTH FROM TIMESTAMP $7),
        "endDay" = EXTRACT(DAY FROM TIMESTAMP $7),
        "allDay" = $8,
        "title" = $9,
        "decription" = $10,
        "lable" = $11,
        "trans" = $12
        WHERE "eventId" = $1
        AND "userId" = $2
        RETURNING *
    `;
    return db.one(sql, [eventId, userId, location, lng, lat, startTs, endTs, allDay, title, decription, lable, trans]);
}

function day(userId, startTime, endTime) {
    const sql = `
        SELECT *
        FROM events
        WHERE "userId" = $1
        AND "endTs" >= $2
        AND "startTs" < $3
        ORDER BY "startTs" ASC
    `;
    return db.any(sql, [userId, startTime, endTime]);
}

function month(userId, startTime, endTime) {
    const sql = `
        SELECT "startTs", "endTs", "startMonth", "startDay", "endMonth", "endDay"
        FROM events
        WHERE "userId" = $1
        AND "endTs" >= $2
        AND "startTs" <= $3
        ORDER BY "startTs" ASC
    `;
    return db.any(sql, [userId, startTime, endTime]);
}

function next(userId) {
    const sql = `
        SELECT *
        FROM events
        WHERE "userId" = $1
        AND "startTs" > now()
        ORDER BY "startTs" ASC
        LIMIT 1
    `;
    let tmp = {};
    try{
      tmp = db.any(sql, userId);
    }catch(err){

    }
    return tmp;
}

function del(eventId, userId) {
    const sql = `
        DELETE FROM events
        WHERE "eventId" = $1
        AND "userId" = $2
    `;
    db.any(sql, [eventId, userId]);
    return new Promise((resolve, reject) => {
      resolve(JSON.parse('{"message":"You delete successfully"}'));
    });
}

module.exports = {
    list,
    create,
    accesstoken,
    modify,
    month,
    day,
    next,
    del
};
