export const formValidator= {
    "email":{
        "regexp":'^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$',
        "errorInfo":{
            emptyInfo:'邮箱不能为空',
            lengthInfo:'请输入至少5位字符',
            errorInfo:'请正确输入邮箱，例如：888888@qq.com'
        }
    },
    "name":{
        "regexp":"[\\`~!@#\\$%\\^&\\*\\(\\)\\+=\\|\\{\\}\\':;\\',\\\\\\[\\]\\.<>\\\\\\/\\?~！@#￥%……&\\*（）——+|{}【】‘；：”“’。，、？]",
        "errorInfo":{
            emptyInfo:'数据源名称不能为空',
            emptyInfobaseName:'数据库名称不能为空',
            emptyInfofolderName:'名称不能为空',
            emptyInfofolderspecial:'名称中不可包含特殊字符',
            emptyInfofolderNameLength:'名称包含字符不可超出255',
            emptyInfoname:'用户名不能为空',
            emptyInfobasewarehouse:'spark库不能为空',
            lengthInfo:'请输入至少两位字符',
            errorInfo:'您输入的内容含有特殊字符.'
        }
    },
    "ip":{
        "regexp":'^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$',
        "errorInfo":{
            emptyInfo:'ip地址不能为空',
            lengthInfo:'请至少输入4位字符',
            errorInfo:'请正确输入IP地址，例如：172.23.4.54'
        }
    },
    "port":{
        "regexp":'^\\d{2,4}$',
        "errorInfo":{
            emptyInfo:'端口号不能为空',
            lengthInfo:'请至少输入两位字符',
            errorInfo:'请正确输入端口号，例如：8080'
        }
    },
    "password":{
        "regexp":'^[a-zA-Z0-9_-]$',
        "errorInfo":{
            emptyInfo:'密码不能为空',
            lengthInfo:'请至少输入6位字符',
            errorInfo:'请输入数字字母下划线的组合'
        }
    },
    "url":{
        "regexp":'^[http|https]{4,5}\\:\\/\\/([a-zA-Z]|[0-9])*(\\.([a-zA-Z]|[0-9])*)*(\\/([a-zA-Z]|[0-9])*)*(\\:[0-9]{0,4})?$',
        "errorInfo":{
            emptyInfo:'url地址不能为空',
            lengthInfo:'请至少输入10位字符',
            errorInfo:'请正确输入url，例如：http://www.baidu.com'
        }
    }
}