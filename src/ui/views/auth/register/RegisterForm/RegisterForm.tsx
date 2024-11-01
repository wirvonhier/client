import Component from 'vue-class-component';
import Vue from 'vue/types/umd';
import { AuthModule, WVHModule } from '@/store';
import { VueComponent } from '@/ui/typings/vue-ts-component';
import Styles from './registerForm.scss';
import SharedStyles from 'styles';
import { WVHButton, Loader } from '@/ui/components';
import { TYPE, POSITION } from 'vue-toastification';
import { PrivacyAndAGBAgreement } from '@/ui/components/formElements';

interface IRefs {
  email: Vue;
  password: Vue;
  passwordRepeat: Vue;
}

interface IErrors {
  email: string[];
  password: string[];
  passwordRepeat: string[];
}

@Component({
  name: 'RegisterForm',
})
export class RegisterForm extends VueComponent<{}, IRefs> {
  constructor() {
    super();
    this.handleKeydown = this._handleKeydown.bind(this);
  }
  public isLoading = false;
  public handleKeydown: (e: KeyboardEvent) => void;
  public authModule = AuthModule.context(this.$store);
  public wvhModule = WVHModule.context(this.$store);
  public errors: IErrors = {
    email: [],
    password: [],
    passwordRepeat: [],
  };

  private formData = {
    email: '',
    password: '',
    passwordRepeat: '',
    dataProtStatementLang: 'de',
    dataProtStatement: '',
  };

  public mounted(): void {
    this.$refs.email.$el.querySelector('input')?.addEventListener('keydown', this.handleKeydown);
    this.$refs.password.$el.querySelector('input')?.addEventListener('keydown', this.handleKeydown);
    this.$refs.passwordRepeat.$el.querySelector('input')?.addEventListener('keydown', this.handleKeydown);
  }

  public beforeUnmount(): void {
    this.$refs.email.$el.querySelector('input')?.removeEventListener('keydown', this.handleKeydown);
    this.$refs.password.$el.querySelector('input')?.removeEventListener('keydown', this.handleKeydown);
    this.$refs.passwordRepeat.$el.querySelector('input')?.removeEventListener('keydown', this.handleKeydown);
  }

  public async register(e: Event): Promise<void> {
    e.preventDefault();
    if (this.isLoading) return;
    this.isLoading = true;
    this.errors.email = this.formData.email.length === 0 ? ['Feld darf nicht leer sein.'] : [];
    this.errors.password = this.formData.password.length === 0 ? ['Feld darf nicht leer sein.'] : [];
    this.errors.passwordRepeat =
      this.formData.password !== this.formData.passwordRepeat ? ['Die Passwörter stimmen nicht überein.'] : [];

    if (this.errors.email.length > 0 || this.errors.password.length > 0 || this.errors.passwordRepeat.length > 0) {
      this.isLoading = false;
      return;
    }

    const dataProtStatement = this.wvhModule.state.dataProtStatements && this.wvhModule.state.dataProtStatements[0];

    if (!dataProtStatement) {
      this.$toast('Fehlgeschlagen. Bitte überprüfe deine Internetverbindung und versuche es erneut.', {
        type: TYPE.ERROR,
        timeout: 10000,
        position: POSITION.TOP_CENTER,
      });
      this.isLoading = false;
      return;
    }

    const payload = {
      email: this.formData.email.toLowerCase(),
      password: this.formData.password,
      dataProtStatementLang: this.formData.dataProtStatementLang,
      dataProtStatement: this.formData.dataProtStatement,
    };

    payload.dataProtStatement = dataProtStatement.version;
    const res = await this.authModule.actions.register(payload);
    if (res.status === 'failure') {
      this.$toast(res.message, { type: TYPE.ERROR, timeout: 15000, position: POSITION.TOP_CENTER });
    }
    if (res.status === 'success') {
      this.$router.push({ name: 'BusinessRegisterComplete' });
    }
    this.isLoading = false;
  }

  public update(key: 'email' | 'password' | 'passwordRepeat', value: string): void {
    this.formData[key] = value;
  }

  // @ts-ignore: Declared variable is not read
  public render(h): Vue.VNode {
    return (
      <form class={Styles['register__form']}>
        <div class={SharedStyles['input__wrapper']}>
          <v-text-field
            ref="email"
            class={`${SharedStyles['input__login--text_amplifier']}`}
            label="EMAIL"
            autocomplete="email"
            error-messages={this.errors.email}
            value={this.formData.email}
            on-input={(value: string) => this.update('email', value)}
          />
        </div>
        <div class={SharedStyles['input__wrapper']}>
          <v-text-field
            ref="password"
            class={`${SharedStyles['input__login--text_amplifier']}`}
            type="password"
            label="PASSWORT"
            autocomplete="new-password"
            error-messages={this.errors.password}
            value={this.formData.password}
            on-input={(value: string) => this.update('password', value)}
          />
        </div>
        <div class={SharedStyles['input__wrapper']}>
          <v-text-field
            ref="passwordRepeat"
            class={`${SharedStyles['input__login--text_amplifier']}`}
            type="password"
            autocomplete="new-password"
            label="PASSWORT WIEDERHOLEN"
            error-messages={this.errors.passwordRepeat}
            value={this.formData.passwordRepeat}
            on-input={(value: string) => this.update('passwordRepeat', value)}
          />
        </div>
        <div class={SharedStyles['input__wrapper']}>
          <PrivacyAndAGBAgreement />
        </div>
        <WVHButton primary class={SharedStyles['submit']} on-click={this.register.bind(this)}>
          {this.isLoading ? <Loader color="#fff" size={24} /> : 'Registrieren'}
        </WVHButton>
      </form>
    );
  }

  private _handleKeydown(e: KeyboardEvent): void {
    if (e.keyCode === 13) {
      this.register(e);
    }
  }
}
