# مشكلة في صلاحيات GitHub Token

## المشكلة
الـ API Token الحالي لا يملك صلاحية الكتابة للمستودعات.

## الحل 1: تحديث صلاحيات الـ Token

### الخطوات:

1. **اذهب إلى إعدادات GitHub:**
   - افتح: https://github.com/settings/tokens

2. **أنشئ Token جديد:**
   - اضغط على **"Generate new token"** → **"Generate new token (classic)"**
   
3. **أعطه الصلاحيات التالية:**
   - ✅ **repo** (Full control of private repositories)
   - ✅ **workflow** (Update GitHub Action workflows)

4. **انسخ الـ Token وأضفه في Antigravity**

---

## الحل 2: استخدام Git مباشرة (الأسهل)

### الخطوات:

1. **حمّل وثبت Git:**
   - من: https://git-scm.com/download/win
   - ثبته بالإعدادات الافتراضية

2. **شغّل الملف:**
   - افتح مجلد المشروع
   - انقر مرتين على `upload_to_github.bat`
   - سيقوم بكل شيء تلقائياً

3. **سجل دخول GitHub:**
   - عندما يطلب منك، سجل دخول في المتصفح

---

## بعد رفع المشروع

1. اذهب إلى: https://vercel.com
2. اضغط **New Project**
3. اختر `ecommerce-store`
4. أضف المتغيرات البيئية:
   - `DATABASE_URL` (من Neon)
   - `AUTH_SECRET` (مفتاح عشوائي)
5. اضغط **Deploy**

---

**أي طريقة تختار، أخبرني عندما تنتهي!**
