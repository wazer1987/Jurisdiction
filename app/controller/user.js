'use strict';
const BaseController = require('./base');
const md5 = require('md5');
class UserController extends BaseController {
  async getRoutes() {
    const { ctx } = this;
    const data = await ctx.model.Roles.findOne({}, { _id: false });
    this.success(data);
  }
  async getInfo() {
    const { ctx } = this;
    const { email } = ctx.request.query;
    const res = await ctx.model.User.findOne({ email }, { nickname: true, roles: true, _id: false });
    this.success(res);
  }
  async login() {
    const { ctx, app } = this;
    const { email, password } = ctx.request.body;
    const user = await ctx.model.User.findOne({ email, password: md5(password) });
    if (user) {
      const { nickname } = user;
      const token = app.jwt.sign({
        nickname,
        email,
        id: user._id,
      }, app.config.jwt.secret, {
        expiresIn: '1h',
      });
      this.success({ token, email, nickname });
    } else {
      this.error('用户名或者密码错误');
    }
  }
  async checkemail(email) {
    const user = await this.ctx.model.User.findOne({ email });
    return user;
  }
  async regedit() {
    const { ctx } = this;
    const { nickname, email, password, emailcode, imgcode } = ctx.request.body;
    console.log(ctx.request.body, '-----我是前端传过来的');
    if (emailcode !== ctx.session.emailcode) {
      return this.error('邮箱验证码出错');
    }
    if (imgcode.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('图片验证码错误');
    }
    if (await this.checkemail(email)) {
      return this.error('邮箱已经存在');
    }
    const ret = await ctx.model.User.create({
      nickname,
      email,
      // 这里使用md5把密码加密
      password: md5(password),
    });
    if (ret._id) {
      this.success('注册成功');
    }
  }
  async captcha() {
    const { ctx } = this;
    // 调用了service的文件夹里tolls的方法 生成了随机的图片验证码
    const captcha = await this.service.tools.captcha();
    // 把后台刚刚生成的随机验证码放在了session里
    ctx.session.captcha = captcha.text;
    // 设置了响应头的类型
    ctx.response.type = 'image/svg+xml';
    // 然后把数据传送了回去
    ctx.body = captcha.data;
  }
  async email() {
    const { ctx } = this;
    const email = ctx.query.email;
    const code = Math.random()
      .toString()
      .slice(2, 6);
    // 编写给你邮箱发送的内容  邮箱里可以写html格式
    const title = '权限测试';
    const html = `
      <h1>权限测试验证码</h1>
      <div>
        <a href="https://wazer1987.github.io/">${code}</a>
      </div>
    `;
    // 我们在service的文件夹下新建了一个tool的js文件里面有sendEmail方法  这里就需要用到 nodemailer 记得安装
    const hasSend = await this.service.tools.sendEmail(email, title, html);
    // 如果我们哪个第三方发送邮件的方法成功了就会给我们返回一个值
    if (hasSend) {
      // 然后我们把我们写好的验证码存放在session当中
      ctx.session.emailcode = code;
      // 返还给前端消息 说发送成功
      this.message('发送成功');
    } else {
      // 如果失败了 返还给前端消息说发送失败
      this.error('发送失败');
    }
  }
}

module.exports = UserController;
