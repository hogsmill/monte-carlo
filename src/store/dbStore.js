
function updateCompanies(db, io) {
  db.gameCollection.find().toArray(function(err, res) {
    if (err) throw err
    if (res.length) {
      const companies = []
      for (let i = 0; i < res.length; i++) {
        companies.push({name: res[i].company, teams: res[i].teams})
      }
      io.emit('updateCompanies', {companies: companies})
    }
  })
}

module.exports = {

  getCompanies: function(db, io, debugOn) {

    if (debugOn) { console.log('getCompanies') }

    updateCompanies(db, io)
  },

  getDefault: function(db, io, data, debugOn) {

    if (debugOn) { console.log('getDefault', data) }

    db.gameCollection.findOne({company: data.company}, function(err, res) {
      if (err) throw err
      if (res) {
        for (let i = 0; i < res.teams.length; i++) {
          if (res.teams[i].name == data.team) {
            io.emit('updateDefault', res.teams[i].defaults)
          }
        }
      }
    })
  },

  addCompany: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addCompany', data) }

    db.gameCollection.findOne({name: data.company}, function(err, res) {
      if (err) throw err
      if (!res) {
        db.gameCollection.insertOne({name: data.company, teams: [{name: data.team, defaults: {}}]}, function(err, res) {
          if (err) throw err
          updateCompanies(db, io)
        })
      } else {
        const teams = []
        let found = false
        for (let i = 0; i < res.teams.length; i++) {
          teams.push(res.teams[i])
          if (res.teams[i].name == data.team) {
            found = true
          }
        }
        if (!found) {
          teams.push({name: data.team, defaults: {}})
        }
        const id = res._id
        delete res.id
        res.teams = teams
        db.gameCollection.updateOne({'_id': id}, {$set: res}, function(err, res) {
          if (err) throw err
          updateCompanies(db, io)
        })
      }
    })
  },

  updateDefault: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateDefault', data) }

    db.gameCollection.findOne({name: data.company}, function(err, res) {
      if (err) throw err
      const teams = []
      for (let i = 0; i < res.teams.length; i++) {
        const team = res.teams[i]
        if (team.name == data.team) {
          team.defaults[data.field] = data.value
        }
        teams.push(res.teams[i])
      }
      const id = res._id
      delete res.id
      res.teams = teams
      db.gameCollection.updateOne({'_id': id}, {$set: res}, function(err, res) {
        if (err) throw err
        updateCompanies(db, io)
      })
    })
  }

}
