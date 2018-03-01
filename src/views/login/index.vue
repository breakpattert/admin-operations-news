<template>
    <div class="login-container">
        <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left"
                 label-width="0px"
                 class="card-box login-form">
            <h3 class="title">系统登录</h3>
            <el-form-item prop="email">
                <span class="svg-container"><wscn-icon-svg icon-class="jiedianyoujian"/></span>
                <el-input name="email" type="text" v-model="loginForm.email" autoComplete="on"
                          placeholder="请输入帐户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg-container"><wscn-icon-svg icon-class="mima"/></span>
                <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password"
                          autoComplete="on" placeholder="请输入密码">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
                    登录
                </el-button>
            </el-form-item>
            <div class='tips'>admin账号为:admin 密码为管理员密码</div>
          
            <router-link to="/sendpwd" class="forget-pwd">
                	忘记密码?(或首次登录)
            </router-link>
        </el-form>
        <el-dialog title="第三方验证" :visible.sync="showDialog">
            	邮箱登录成功,请选择第三方验证
            <socialSign></socialSign>
        </el-dialog>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    //判断是否是公司的邮箱对邮箱的一个正则
    import { isWscnEmail } from 'utils/validate';
    // import { getQueryObject } from 'utils';
    //切换到其他方式登录
    import socialSign from './socialsignin';
    

    export default {
    	
      components: { socialSign },
      name: 'login',
      data() {
      	
  
//    	isWscnEmail就是validate里面对邮箱的一个判断
        const validateEmail = (rule, value, callback) => {
//      	验证邮箱
//        if (!isWscnEmail(value)) {
//          callback();
////          callback(new Error('请输入公司邮箱'));
//        } else {
//          callback();
//        }
		  if (value.length < 5) {
            callback(new Error('账号不能小于6位'));
          }
          if(this.loginForm.email=='admin') {
            callback();
          }else{
          	 callback('账号错误请重新输入');
          }


        };
        const validatePass = (rule, value, callback) => {
          if (value.length < 6) {
            callback(new Error('密码不能小于6位'));
          }
          if(this.loginForm.password=='Fmfm2017') {
            callback();
          }else{
          	 callback('密码错误请重新输入');
          }
        };
//          let validatorPass = (rule, value, callback) => {
//    if (!value) {
//      callback(new Error('请输入密码'))
//    } else if (!/^[A-Za-z0-9]+$/.test(value) || value.length < 6) {
//      callback(new Error('密码只能是6位以上英文或者数字'))
//    } else {
//      callback()
//    }
//  }
        
        return {
//      	默认的数据

          loginForm: {
            email: '',
            password: ''
          },
//        loginRules这个放在表头对整个submint做一个验证效果
          loginRules: {
//        	 validateEmail这个是对邮箱做了一个判断和固定修饰
            email: [
                { required: true, trigger: 'blur', validator: validateEmail }
            ],
            password: [
                { required: true, trigger: 'blur', validator: validatePass }
            ]
          },
          loading: false,
          showDialog: false
        }
      },
      computed: {
        ...mapGetters([
          'auth_type'
        ])
      },
      methods: {
        handleLogin() {
        	var storage=window.localStorage;
        	//对应的是for表单上的loginFrom里面的数据通过validate
          this.$refs.loginForm.validate(valid => {
            if (valid) {
              this.loaindg = true;
//            dispatch内传入验证和邮箱以及密码
//LoginByEmail在login.js里面的export出来的email和password，再把this.loginForm传入进去做一个判断
              this.$store.dispatch('LoginByEmail', this.loginForm).then(() => {
                this.loading = false;
                
        storage.setItem('user',JSON.stringify(this.loginForm));
		
//		var userobj=JSON.parse(localStorage.getItem('user'));
//		this.loginForm.email=userobj.email;
//		this.loginForm.password=userobj.password;
//		console.log(userobj);
            this.$router.push({ path: '/' });
                // this.showDialog = true;
              }).catch(err => {
                this.$message.error(err);
                this.loading = false;
              });
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        afterQRScan() {
          // const hash = window.location.hash.slice(1);
          // const hashObj = getQueryObject(hash);
          // const originUrl = window.location.origin;
          // history.replaceState({}, '', originUrl);
          // const codeMap = {
          //   wechat: 'code',
          //   tencent: 'code'
          // };
          // const codeName = hashObj[codeMap[this.auth_type]];
          // if (!codeName) {
          //   alert('第三方登录失败');
          // } else {
          //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
          //     this.$router.push({ path: '/' });
          //   });
          // }
        }
      },
      created() {
        // window.addEventListener('hashchange', this.afterQRScan);
        			var userobj=JSON.parse(window.localStorage.getItem('user'));
        			this.loginForm.email=userobj.email;
					this.loginForm.password=userobj.password;
			console.log( userobj);
      },
      destroyed() {
        // window.removeEventListener('hashchange', this.afterQRScan);
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "src/styles/mixin.scss";
    .tips{
      font-size: 14px;
      color: #fff;
      margin-bottom: 5px;
    }
    .login-container {
        @include relative;
        height: 100vh;
        background-color: #2d3a4b;

        input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
            -webkit-text-fill-color: #fff !important;
        }
        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: #eeeeee;
            height: 47px;
        }
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;
        }
        .svg-container {
            padding: 6px 5px 6px 15px;
            color: #889aa4;
        }

        .title {
            font-size: 26px;
            font-weight: 400;
            color: #eeeeee;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }

        .login-form {
            position: absolute;
            left: 0;
            right: 0;
            width: 400px;
            padding: 35px 35px 15px 35px;
            margin: 120px auto;
        }

        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }

        .forget-pwd {
            color: #fff;
        }
    }

</style>
