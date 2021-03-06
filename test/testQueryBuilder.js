"use strict";

var expect = require('chai').expect;
var qb = require('../server/util/databaseUtil/QueryBuilder');
var lit = require('../server/util/Literals');
var generator = require('../server/util/Generator');
var Query = require('../server/util/databaseUtil/SQLQuery').SQLQuery;

describe('QueryBuilder', function() {
    describe('#delete()', function() {
        it('should produce a valid DELETE query string', function() {
            expect(qb.delete(lit.tables.USER, 'qbd1')).to.equal("DELETE FROM user WHERE id='qbd1';");
        });

        it('should return undefined if an invalid table was passed to delete', function() {
            expect(qb.delete('neat', 'qbd2')).to.equal(undefined);
        });
    });

    describe('#escapeLimit()', function() {
        it('should properly escape the limit provided and produce the limit substring', function() {
            expect(qb.escapeLimit(35)).to.equal("LIMIT 35");
        });

        it('should allow an escape even if a string is passed in', function() {
            expect(qb.escapeLimit('22')).to.equal('LIMIT 22');
        });

        it('should not allow an object to get passed in as the limit', function() {
            expect(qb.escapeLimit({})).to.equal('LIMIT undefined');
        });
    });

    describe('#escapeOrderBy()', function() {
        it('should return the ORDER BY string for a valid table-field pair and asc/desc string', function() {
            expect(qb.escapeOrderBy(lit.tables.USER, 'username', lit.sql.query.ASC)).to.equal("ORDER BY username ASC");
            expect(qb.escapeOrderBy(lit.tables.USER, 'username', lit.sql.query.DESC)).to.equal("ORDER BY username DESC");
            expect(qb.escapeOrderBy(lit.tables.USER, 'username', lit.sql.query.asc)).to.equal("ORDER BY username asc");
            expect(qb.escapeOrderBy(lit.tables.USER, 'username', lit.sql.query.desc)).to.equal("ORDER BY username desc");
        });

        it('will return undefined if an invalid field is passed in', function() {
            expect(qb.escapeOrderBy(lit.tables.USER, 'carsonizfly', lit.sql.query.ASC)).to.equal(undefined);
        });

        it('will return undefined if an invalid table is passed in', function() {
            expect(qb.escapeOrderBy('michaelisbetterthancarson', 'username', lit.sql.query.ASC)).to.equal(undefined);
        });

        it('will return undefined if an invalid sort string is passed in', function() {
            expect(qb.escapeOrderBy(lit.tables.USER, 'username', 'blah')).to.equal(undefined);
        });
    });

    describe('#get()', function() {
        it('should produce a valid SELECT query string', function() {
            expect(qb.get(lit.tables.USER, 'qbg1')).to.equal("SELECT * FROM user WHERE id='qbg1';");
        });

        it('should return undefined if an invalid table was passed to get', function() {
            expect(qb.get('neat', 'qbg2')).to.equal(undefined);
        });
    });

    describe('#insert()', function() {
        it('should create a valid INSERT query string', function() {
            var result = "INSERT INTO user (id, username, netVotes, totalUpvotes, totalDownvotes) " +
                "VALUES ('qbi1', 'PhilPickle', 15, 30, 15);";
            var dbo = {
                id: 'qbi1',
                username: 'PhilPickle',
                netVotes: 15,
                totalUpvotes: 30,
                totalDownvotes: 15
            };
            expect(qb.insert(lit.tables.USER, dbo)).to.equal(result)
        });

        it('should return undefined if an invalid table is provided', function() {
            var dbo = {
                id: 'qbi2',
                username: 'PhilPickle'
            };
            expect(qb.insert('aFakeTable', dbo)).to.equal(undefined)
        });

        it('should return undefined if an invalid field for a table is in the dbobject', function() {
            var dbo = {
                id: 'qbi3',
                username: 'PhilPickle',
                michaelWritesSickTests: 15
            };
            expect(qb.insert(lit.tables.USER, dbo)).to.equal(undefined);
        });

        it('should return undefined if anything but an object is passed in for the dbo parameter', function() {
            expect(qb.insert(lit.tables.USER, 43)).to.equal(undefined);
            expect(qb.insert(lit.tables.USER, 'hello')).to.equal(undefined);
            expect(qb.insert(lit.tables.USER, [])).to.equal(undefined);
        });
    });

    describe('#isValidFieldName()', function() {
        it('should allow a normal string through with no issue', function() {
            var idString = 'ufs6jhhbjavxymgt0m8a1x024pcj7khx';
            expect(qb.escapeID(idString)).to.equal('\'' + idString + '\'');
        });

        it('should allow any id string generated by the generator', function() {
            var str1 = generator.generate();
            var str2 = generator.generate();
            var str3 = generator.generate();
            expect(qb.escapeID(str1)).to.equal('\'' + str1 + '\'');
            expect(qb.escapeID(str2)).to.equal('\'' + str2 + '\'');
            expect(qb.escapeID(str3)).to.equal('\'' + str3 + '\'');
        });

        it('should not allow unescaped semicolons through', function() {
            expect(qb.escapeID(';')).to.equal('\';\'');
        });

        it('should not allow malicious SQL through without escaping', function() {
            expect(qb.escapeID(';SELECT * FROM user;')).to.equal('\';SELECT * FROM user;\'');
        });
    });

    describe('#update()', function() {
        it('should produce a valid UPDATE string based on the current DBRow', function() {
            var dbo = {
                id: 'qbu1',
                username: 'PhilPickle',
                netVotes: 15,
                totalUpvotes: 30,
                totalDownvotes: 15
            };

            var result = "UPDATE user SET username='PhilPickle', netVotes=15, totalUpvotes=30, totalDownvotes=15 " +
                "WHERE id='qbu1';";

            expect(qb.update(lit.tables.USER, dbo)).to.equal(result);
        });

        it('should return a broken query if an invalid field for a table is in the dbobject', function() {
            var dbo = {
                id: 'qbu2',
                username: 'PhilPickle',
                michaelWritesSickTests: 15
            };

            expect(qb.update(lit.tables.USER, dbo)).to.equal('UPDATE user SET undefined WHERE id=\'qbu2\';');
        });

        it('should return undefined if an invalid table is passed in', function() {
            var dbo = {
                id: 'qbu3'
            };

            expect(qb.update('sickTest', dbo)).to.equal(undefined);
        });

        it('should return undefined if an empty object is passed in', function() {
            expect(qb.update(lit.tables.USER, {})).to.equal(undefined);
        });

        it('should return undefined if anything but an object is passed in for the dbo parameter', function() {
            expect(qb.update(lit.tables.USER, 43)).to.equal(undefined);
            expect(qb.update(lit.tables.USER, 'hello')).to.equal(undefined);
            expect(qb.update(lit.tables.USER, [])).to.equal(undefined);
        });
    });

    describe('#query()', function() {
        it('should construct a valid SELECT query string with ORs and ANDs', function() {
            var actual = 'SELECT * FROM user WHERE netVotes = 55 AND totalUpvotes = 65 AND totalDownvotes = 65 ' +
                'OR totalDownvotes = 65';
            var qArr = [
                new Query(lit.tables.USER, lit.fields.NETVOTES, lit.sql.query.EQUALS, 55, lit.sql.query.AND),
                new Query(lit.tables.USER, lit.fields.TOTAL_UPVOTES, lit.sql.query.EQUALS, 65, lit.sql.query.AND),
                new Query(lit.tables.USER, lit.fields.TOTAL_DOWNVOTES, lit.sql.query.EQUALS, 65, lit.sql.query.AND),
                new Query(lit.tables.USER, lit.fields.TOTAL_DOWNVOTES, lit.sql.query.EQUALS, 65, lit.sql.query.OR)
            ];

            expect(qb.query(lit.tables.USER, qArr)).to.equal(actual);
        });

        it('should construct a valid SELECT query with only ANDs', function() {
            var actual = 'SELECT * FROM user WHERE netVotes = 55 AND totalUpvotes >= 65 AND totalDownvotes <= 65';
            var qArr = [
                new Query(lit.tables.USER, lit.fields.NETVOTES, lit.sql.query.EQUALS, 55, lit.sql.query.AND),
                new Query(lit.tables.USER, lit.fields.TOTAL_UPVOTES, lit.sql.query.GREATER_THAN_OR_EQUAL_TO, 65,
                    lit.sql.query.AND),
                new Query(lit.tables.USER, lit.fields.TOTAL_DOWNVOTES, lit.sql.query.LESS_THAN_OR_EQUAL_TO, 65,
                    lit.sql.query.AND)
            ];

            expect(qb.query(lit.tables.USER, qArr)).to.equal(actual);
        });

        it('should construct a valid SELECT query with only ORs', function() {
            var actual = 'SELECT * FROM user WHERE netVotes = 55 OR totalUpvotes >= 65 OR totalDownvotes <= 65';
            var qArr = [
                new Query(lit.tables.USER, lit.fields.NETVOTES, lit.sql.query.EQUALS, 55, lit.sql.query.OR),
                new Query(lit.tables.USER, lit.fields.TOTAL_UPVOTES, lit.sql.query.GREATER_THAN_OR_EQUAL_TO, 65,
                    lit.sql.query.OR),
                new Query(lit.tables.USER, lit.fields.TOTAL_DOWNVOTES, lit.sql.query.LESS_THAN_OR_EQUAL_TO, 65,
                    lit.sql.query.OR)
            ];

            expect(qb.query(lit.tables.USER, qArr)).to.equal(actual);
        });

        it('should fail to construct a valid query if undefined is an element in the array', function() {
            var actual = 'SELECT * FROM user WHERE undefined';
            var qArr = [
                new Query(lit.tables.USER, lit.fields.NETVOTES, lit.sql.query.EQUALS, 55, lit.sql.query.AND),
                new Query(lit.tables.USER, lit.fields.TOTAL_UPVOTES, lit.sql.query.GREATER_THAN_OR_EQUAL_TO, 65,
                    lit.sql.query.AND),
                undefined
            ];
            expect(qb.query(lit.tables.USER, qArr)).to.equal(actual);
        });

        it('should fail to construct a valid query string if an empty query is passed to .query()', function() {
            var actual = 'SELECT * FROM user WHERE netVotes = 55 AND totalUpvotes >= 65 undefined undefined = null';
            var qArr = [
                new Query(lit.tables.USER, lit.fields.NETVOTES, lit.sql.query.EQUALS, 55, lit.sql.query.AND),
                new Query(lit.tables.USER, lit.fields.TOTAL_UPVOTES, lit.sql.query.GREATER_THAN_OR_EQUAL_TO, 65,
                    lit.sql.query.AND),
                new Query()
            ];
            expect(qb.query(lit.tables.USER, qArr)).to.equal(actual);
        });

        it('should create a valid query string if an empty array is passed to .query()', function() {
            var actual = 'SELECT * FROM user';
            var qArr = [];
            expect(qb.query(lit.tables.USER, qArr)).to.equal(actual);
        });
    });
});