import './assets/tailwind.css';
import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import { Quasar, Notify, Dialog } from 'quasar';
import quasarLang from 'quasar/lang/id';
import quasarIconSet from 'quasar/icon-set/material-icons-outlined';

// Import icon libraries
// ..required because of selected iconSet:
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';
import '@quasar/extras/material-icons-round/material-icons-round.css';
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css';
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css';
import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css';
import '@quasar/extras/material-symbols-sharp/material-symbols-sharp.css';

// Import Quasar css
import 'quasar/src/css/index.sass';

import App from './App.vue';
import router from './router';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(Quasar, {
    plugins: { Notify, Dialog }, // import Quasar plugins and add here
    lang: quasarLang,
    iconSet: quasarIconSet,
    // config: {
    //   // brand: {
    //   //   // primary: '#e46262',
    //   //   // ... or all other brand colors
    //   // },
    //   // notify: {...}, // default set of options for Notify Quasar plugin
    //   // loading: {...}, // default set of options for Loading Quasar plugin
    //   // loadingBar: { ... }, // settings for LoadingBar Quasar plugin
    //   // ..and many more (check Installation card on each Quasar component/directive/plugin)
    // },
});
app.mount('#app');
