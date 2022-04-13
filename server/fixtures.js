import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { CompaniesCollection } from '/imports/api/companies';
import { LevelsCollection } from '/imports/api/levelsUnits';
import { ParticipationsCollection } from '/imports/api/participations';

const URL_API_DIGITALOCEAN = '';
const URL_COMPANIES = `${URL_API_DIGITALOCEAN}`;

const headers = {
  'Authorization': '',
  'content-type': 'application/json'
};

Meteor.startup(() => {
  // Agregar super usuario
  if (Meteor.users.find().count() === 0) {

    const adminId = Accounts.createUser({
      username: 'admin',
      password: 'Password1',
      profile: {
        name: 'Admin',
        lastName: '',
        image: '',
        enable: true,
      }
    });
  
    Roles.createRole('superadmin', { unlessExists: true });
    Roles.addUsersToRoles(adminId, [ 'superadmin' ]);

    console.log('Admin user created: ', adminId);
  };

  if (CompaniesCollection.find().count() == 0) {
    HTTP.call('GET', URL_COMPANIES, { headers }, (error, result) => {
      if (error) {
        console.error('Error al obtener la información: ', error);
      } else {
        const domainRecords = result.data.domain_records;
        console.log('Companies => ', domainRecords);
        const aRecords = domainRecords.filter(record => {
          return record.type == 'A';
        });
        aRecords.forEach(record => {
          CompaniesCollection.insert({
            subdomain: record.name,
            server: record.data,
            name: `${record.name}.goandsee.co`,
          });
        });
      }
    });
  }

  if (ParticipationsCollection.find().count() == 0) {

    const companies = [{
      "company": "Tijuana",
      "buData": [
        {
          currentHead1: 260,
          currentHead2: 300,
          "bu": "Cellular"
        },
        {
          currentHead1: 45,
          currentHead2: 33,
          "bu": "Pleated"
        },
        {
          currentHead1: 0,
          currentHead2: 0,
          "bu": "Roman"
        },
        {
          currentHead1: 0,
          currentHead2: 0,
          "bu": "Natural"
        },
        {
          currentHead1: 17,
          currentHead2: 14,
          "bu": "Strip"
        }]
      },
      {
        "company": "Reynosa 1",
        "url": "https://swf-ry.goandsee.co",
        "country": "mexico",
        "buData": [
          {
            currentHead1: 410,
            currentHead2: 400,
            "bu": "Fauxwood"
          },
          {
            currentHead1: 98,
            currentHead2: 78,
            "bu": "MTM"
          },
          {
            currentHead1: 35,
            currentHead2: 32,
            "bu": "SHUTTERS COMPOSITE"
          },
          {
            currentHead1: 58,
            currentHead2: 55,
            "bu": "SHUTTERS WOOD"
          },
          {
            currentHead1: 92,
            currentHead2: 87,
            "bu": "WOOD BLINDS"
          }]
      },
      {
        "company": "Reynosa 2",
        "url": "https://swf-ry2.goandsee.co",
        "country": "mexico",
        "buData": [
          {
            currentHead1: 0,
            currentHead2: 0,
            "bu": "Coil painting"
          },
          {
            currentHead1: 0,
            currentHead2: 0,
            "bu": "Extrusion"
          },
          {
            currentHead1: 110,
            currentHead2: 109,
            "bu": "MSS-Mecho"
          },
          {
            currentHead1: 16,
            currentHead2: 0,
            "bu": "Panel track"
          },
          {
            currentHead1: 59,
            currentHead2: 59,
            "bu": "Solar contract"
          },
          {
            currentHead1: 295,
            currentHead2: 280,
            "bu": "Solar residential"
          }]
      },
      {
        "company": "Victoria",
        "url": "https://swf-victoria.goandsee.co",
        "country": "mexico",
        "buData": [
          {
            currentHead1: 0,
            currentHead2: 0,
            "bu": "Verticals"
          },
          {
            currentHead1: 0,
            currentHead2: 0,
            "bu": "Horizontals"
          },
          {
            currentHead1: 0,
            currentHead2: 0,
            "bu": "Sheer and Layer"
          },
          {
            currentHead1: 0,
            currentHead2: 0,
            "bu": "Soft Verticals"
          }
        ]
      },
      {
        "company": "Grayling",
        "url": "https://swf-grayling.goandsee.co",
        "country": "usa",
        "buData": [{
          bu: "Wood Components",
          currentHead1: 33,
          currentHead2: 9,
        }]
      },
      {
        "company": "Edison",
        "url": "https://swfedison.goandsee.co",
        "country": "usa",
        "buData": [
          {
            currentHead1: 0,
            currentHead2: 0,
            "bu": "Assembly"
          }
        ]
      },
      {
        "company": "Horizons",
        "url": "https://swfhorizons.goandsee.co",
        "country": "usa",
        "buData": [
          {
            currentHead1: 23,
            currentHead2: 7,
            "bu": "Draperies"
          },
          {
            currentHead1: 88,
            currentHead2: 34,
            "bu": "Natural Shades"
          },
          {
            currentHead1: 19,
            currentHead2: 2,
            "bu": "Roller Shades"
          },
          {
            currentHead1: 21,
            currentHead2: 21,
            "bu": "Soft Roman"
          },
          {
            currentHead1: 12,
            currentHead2: 0,
            "bu": "Top Treatments"
          }]
      },
      {
        "company": "Middleton",
        "url": "https://swfmiddleton.goandsee.co",
        "country": "usa",
        "buData": [
          {
            currentHead1: 0,
            currentHead2: 0,
            "bu": "Injection Molding"
          },
          {
            currentHead1: 0,
            currentHead2: 0,
            "bu": "PVC Extrusion"
          },
          {
            currentHead1: 0,
            currentHead2: 0,
            "bu": "Press Room"
          },
          {
            currentHead1: 0,
            currentHead2: 0,
            "bu": "Paint Line"
          },
          {
            currentHead1: 0,
            currentHead2: 0,
            "bu": "Sub Assembly"
          },
          {
            currentHead1: 0,
            currentHead2: 0,
            "bu": "Custom Rods"
          },
          {
            currentHead1: 0,
            currentHead2: 0,
            "bu": "Fabric Print"
          },
          {
            currentHead1: 0,
            currentHead2: 0,
            "bu": "Fabric Processing"
          }
        ]
      }, {
        company: 'Cesta',
        buData: [
          {
            bu: 'Shades',
            currentHead1: 47,
            currentHead2: 0,
          },
          {
            bu: 'Drapes',
            currentHead1: 39,
            currentHead2: 0,
          },
          {
            bu: 'Top Treatments',
            currentHead1: 10,
            currentHead2: 0,
          }]
      }
    ];
  
    companies.forEach(companyData => ParticipationsCollection.insert(companyData));
    console.log('Inserted company participations');
  }
  
  if (LevelsCollection.find().count() == 0) {
  
    const companies = [
      { company: "Tijuana" },
      { company: "Reynosa 1" },
      { company: "Reynosa 2" },
      { company: "Victoria" },
      { company: "Grayling" },
      { company: "Edison" },
      { company: "Horizons" },
      { company: "Middleton" },
      { company: "Cesta" }
    ];
  
    companies.forEach(companyData => {
      LevelsCollection.insert({ name: 'Level 1', company: companyData.company, positions: [], description: '' });
      LevelsCollection.insert({ name: 'Level 2', company: companyData.company, positions: [], description: '' });
      LevelsCollection.insert({ name: 'Level 3', company: companyData.company, positions: [], description: '' });
    });
  
    console.log('Inserted levels');
  }

});
