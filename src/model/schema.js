require('../../config.js');
const pgp = require('pg-promise')();
const db = pgp(process.env.DB_URL);

const schemaSql = `
    -- Extensions
    CREATE EXTENSION IF NOT EXISTS pg_trgm;

    -- Drop (droppable only when no dependency)
    DROP INDEX IF EXISTS events_idx_startTs;
    DROP INDEX IF EXISTS events_idx_startDay;
    DROP INDEX IF EXISTS events_idx_startMonth;
    DROP INDEX IF EXISTS events_idx_userId;
    DROP TABLE IF EXISTS events;
    DROP TYPE IF EXISTS trans;

    -- Create
    CREATE TYPE trans AS ENUM (
        'walking',
        'cycling',
        'driving',
        ''
    );
    CREATE TABLE events (
        "eventId"       serial PRIMARY KEY NOT NULL,
        "userId"        text NOT NULL,
        location        text,
        lng             double precision,
        lat             double precision,
        "startTs"       timestamp with time zone NOT NULL,
        "endTs"         timestamp with time zone,
        "startYear"     integer NOT NULL,
        "startMonth"    integer NOT NULL,
        "startDay"      integer NOT NULL,
        "endYear"       integer,
        "endMonth"      integer,
        "endDay"        integer,
        "allDay"        boolean NOT NULL,
        title           text NOT NULL,
        decription      text,
        lable           text,
        trans           trans
    );
    CREATE INDEX events_idx_startTs ON events USING btree("startTs");
    CREATE INDEX events_idx_endTs ON events USING btree("endTs");
    CREATE INDEX events_idx_startDay ON events USING btree("startDay");
    CREATE INDEX events_idx_startMonth ON events USING btree("startMonth");
    CREATE INDEX events_idx_userId ON events USING btree("userId");
`;


const dataSql = `
    -- Populate dummy posts
    INSERT INTO events ("userId", "location", "lng", "lat", "startTs", "endTs", "startYear", "startMonth", "startDay", "endYear", "endMonth", "endDay", "allDay", "title", "decription", "lable", "trans")
    SELECT
        2,
        '',
        null,
        null,
        '2018-02-04T22:44:30.652Z',
        now(),
        EXTRACT(YEAR FROM TIMESTAMP '2018-02-04T22:44:30.652Z'),
        EXTRACT(MONTH FROM TIMESTAMP '2018-02-04T22:44:30.652Z'),
        EXTRACT(DAY FROM TIMESTAMP '2018-02-04T22:44:30.652Z'),
        EXTRACT(YEAR FROM TIMESTAMP 'now()'),
        EXTRACT(MONTH FROM TIMESTAMP 'now()'),
        EXTRACT(DAY FROM TIMESTAMP 'now()'),
        '0',
        'word' || i || ' word' || (i+1) || ' word' || (i+2),
        '',
        '',
        ''
    FROM generate_series(1, 1) AS s(i);
`;


db.none(schemaSql).then(() => {
    console.log('Schema created');
    db.none(dataSql).then(() => {
        console.log('Data populated');
        pgp.end();
    });
}).catch(err => {
    console.log('Error creating schema', err);
});
