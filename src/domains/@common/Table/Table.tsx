import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import * as React from 'react';

import { DownloadList } from 'src/store/@common/entities';

export interface IProjectTaskTypesProps<T> {
  classes: any;
  items: DownloadList<T>;
  perPage?: number;
  renderItem: (item: T) => React.ReactNode;
}

export interface IState {
  page: number | string;
  perPage: number | string;
}

export class TableTsx<T> extends React.Component<IProjectTaskTypesProps<T>, IState> {
  public state = {
    page: 0,
    perPage: 10,
  };

  constructor(props: IProjectTaskTypesProps<T>) {
    super(props);
    this.state = {
      page: 0,
      perPage: (props.perPage || 10) as number,
    };
  }

  public handleChangePage = (e: React.MouseEvent<HTMLButtonElement> | null, page: number = 0) => {
    this.setState({ page });
  };

  public handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | null) => {
    if (event && event.target.value) {
      this.setState({ perPage: event.target.value });
    }
  };

  public render() {
    const { classes, items } = this.props;
    const { page, perPage } = this.state;
    return (
      <Table className={classes.table}>
        {this.props.children}
        <TableBody>{items.slice(page * perPage, (page + 1) * perPage).map(this.props.renderItem)}</TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={3}
              count={items.length}
              rowsPerPage={perPage}
              page={page}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
              labelRowsPerPage={'Элементов на странице'}
              labelDisplayedRows={this.labelDisplayedRows}
            />
          </TableRow>
        </TableFooter>
      </Table>
    );
  }

  private labelDisplayedRows = ({ from, to, count }: any) => {
    return ''
      .concat(from, '-')
      .concat(to, ' из ')
      .concat(count);
  };
}
