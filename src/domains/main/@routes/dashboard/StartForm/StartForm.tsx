import { Theme } from '@material-ui/core/styles';
import * as React from 'react';
import MediaQuery from 'react-responsive';
import { Field, InjectedFormProps } from 'redux-form';
import { required } from 'redux-form-validators';

import { StartStopBtn } from 'src/components/StartStopBtn';
import { ProjectField } from './ProjectField';
import { TaskField } from './TaskField';

export interface IInternalProps {
  classes: any;
  selectProject: any;
  theme: Theme;
}

export interface IStartFormData {
  description: string;
  projectId: number;
}

export class IStartFormProps {
  title?: string;
  buttonText?: string;
}

export const StartFormJsx: React.FunctionComponent<
  IInternalProps & InjectedFormProps<IStartFormData, IStartFormProps>
> = React.memo(({ classes, handleSubmit, initialValues, selectProject, theme }) => (
  <form onSubmit={handleSubmit} className={classes.play}>
    <div className={classes.inputBlock}>
      <Field name="description" component={TaskField} label="Начни новую задачу..." className={classes.input} />
      <MediaQuery minWidth={theme.breakpoints.values.sm}>
        <Field
          className={classes.select}
          name="projectId"
          component={ProjectField}
          label="Проект"
          onChange={selectProject}
          validate={[required({ msg: 'Сначала выберите Проект!' })]}
        />
      </MediaQuery>
    </div>
    <StartStopBtn isStarted={false} isLarge onStart={handleSubmit} />
  </form>
));
