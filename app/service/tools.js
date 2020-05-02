// 首先要加载 svg-captcha 第三方包
'use strict';
const Service = require('egg').Service;
// 这个是生成图片验证码的模块
const svgCaptcha = require('svg-captcha');
const nodemailer = require('nodemailer');
const userEmail = '81902461@qq.com';
const transporter = nodemailer.createTransport({
  service: 'qq',
  port: 465,
  secureConnetion: true,
  auth: {
    user: userEmail,
    pass: 'emdwfgbpwsntcaaf',
  },
});
class ToolsService extends Service {
  async sendEmail(email, title, html) {
    const mailOptions = {
      from: userEmail,
      to: email,
      subject: title,
      text: '',
      html,
    };
    // 尝试着用nodemailer 去发送邮件
    try {
      // 如果成功了就返回true 我们controller层就能做出对应的判断
      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      // 失败了就返回false
      console.log(err);
      return false;
    }
  }
  async captcha() {
    // 配置了一下生成的图片验证码
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
    });
    return captcha;
  }
}
module.exports = ToolsService
;
