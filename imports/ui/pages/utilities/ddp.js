const clients = Meteor.settings.public.companies || [];

export const generateConnection = function(company) {
  const companyData = clients.find(client => {
    return client.company == company;
  });

  return({
    connection: DDP.connect(companyData.url),
    company: companyData.company,
    country: companyData.country,
    areas: companyData.areas,
    url: companyData.url,
  });
};

export const generateAllConnections = function() {
  const ddpConnections = clients.map(client => {
    const connection = DDP.connect(client.url)
    return {
      connection,
      company: client.company,
      country: client.country,
    };
  });

  return ddpConnections;
}

export const checkForConnection = function(conection, updateData = () => {}) {
  const ddpConnection = conection;

  if (!ddpConnection || ddpConnection.connection.status().status != 'connected') {
    setTimeout(() => {
      checkForConnection(conection, updateData);
    }, 500);
  } else {
    updateData();
  }
};

export const checkForAllConnections = function(connectionDdp, updateData = () => {}) {
  const ddpConnections = connectionDdp;
  const allStatus = ddpConnections.map(ddpConnection => {
    return ddpConnection.connection.status().status;
  });

  const noConnected = allStatus.filter(status => status != 'connected');
  if (noConnected.length > 0) {
    setTimeout(() => {
      checkForAllConnections(connectionDdp, updateData);
    }, 500);
  } else {
    console.log('Ya se conecto a todas');
    updateData();
  }
}