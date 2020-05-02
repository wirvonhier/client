import Component from 'vue-class-component';
import { VueComponent } from '@/ui/vue-ts-component';
import Styles from './WVHTextField.scss';
import SharedStyles from '@/ui/styles/main.scss';

type InputType = 'email' | 'hidden' | 'number' | 'password' | 'reset' | 'search' | 'tel' | 'text' | 'url';
interface IProps {
  label: string;
  'max-length'?: string;
  id: string;
  value: string;
  'is-valid': boolean;
  'error-messages': string[];
  placeholder?: string;
  autocomplete?: string;
  required?: boolean;
  type?: InputType;
}

@Component({
  name: 'WVHText',
  props: {
    label: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    errorMessages: {
      type: Array,
      default: () => [],
    },
    maxLength: {
      type: Number,
      default: undefined,
    },
    placeholder: {
      type: String,
      default: '',
    },
    autocomplete: {
      type: String,
      default: 'off',
    },
    type: {
      type: String,
      default: 'text',
    },
    requierd: {
      type: Boolean,
      default: false,
    },
  },
})
export class WVHTextField extends VueComponent<IProps> {
  public maxLength?: number;
  public label!: string;
  public value!: string;
  public autocomplete!: string;
  public placeholder!: string;
  public errorMessages!: string[];
  public required!: boolean;
  public type!: InputType;

  // @ts-ignore
  public render(h): Vue.VNode {
    return (
      <div class={`${Styles['text-input__wrapper']} ${SharedStyles['input__wrapper']}`}>
        <label class={`${Styles['text-input__inner']} ${SharedStyles['input__wrapper']}`}>
          {this.errorMessages.length > 0 && (
            <div class={`${Styles['text-input__errors']} ${SharedStyles['input__errors']}`}>
              {this.errorMessages.map((error) => (
                <div class={`${SharedStyles['input__error']} ${Styles['text-input__error']}`}>{error}</div>
              ))}
            </div>
          )}
          <div class={`${Styles['text-input__label']} ${SharedStyles['input__label']}`}>{this.label}</div>
          <input
            type={this.type}
            autocomplete={this.autocomplete}
            placeholder={this.placeholder}
            class={Styles['text-input']}
          />
        </label>
      </div>
    );
  }
}