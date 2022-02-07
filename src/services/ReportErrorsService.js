const AdminController = require('../controllers/AdminController');

const reportError = async (ctx, error) => {
  const adminListResult = await AdminController.getAdminList();
  if(!adminListResult.ok) {
    return console.log(adminListResult.error);
  }

  const adminList = adminListResult.result;
  console.log(adminList);
  adminList.map(async admin => {
    console.log(admin)
    await ctx.telegram.sendMessage(admin.userId, error);
  });
};

module.exports = {
  reportError,
};
