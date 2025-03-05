/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
import { IAngularEvent } from 'angular';
import { ISortingValues } from '../core';
import { IColumnDef } from './public-interfaces';
import { ITableScope } from './ngTableController';

/**
 * @private
 */
export interface IScopeExtensions {
    sortLive:any;	
    sortBy($column: IColumnDef, event: IAugmentedMouseEvent): void;
}

/**
 * @private
 */
export interface IAugmentedMouseEvent extends IAngularEvent {
    ctrlKey: boolean;
    metaKey: boolean;
}

ngTableSorterRowController.$inject = ['$scope'];

/**
 * Controller for the {@link ngTableSorterRow ngTableSorterRow} directive
 */
export function ngTableSorterRowController<T>($scope: ITableScope<T> & IScopeExtensions) {

    $scope.sortBy = sortBy;

    ///////////    

    function sortBy($column: IColumnDef, event: IAugmentedMouseEvent) {        
        var parsedSortable = $column.sortable && $column.sortable();        
        if (!parsedSortable || typeof parsedSortable !== 'string') {
            return;
        } else {
            var defaultSort = $scope.params.settings().defaultSort;
            var inverseSort = (defaultSort === 'asc' ? 'desc' : 'asc');
            var sorting = $scope.params.sorting() && $scope.params.sorting()[parsedSortable] && ($scope.params.sorting()[parsedSortable] === defaultSort);
            var sortingParams: ISortingValues = (event.ctrlKey || event.metaKey) ? $scope.params.sorting() : {};
            sortingParams[parsedSortable] = (sorting ? inverseSort : defaultSort);
            $scope.params.parameters({
                sorting: sortingParams
            });
            // Update sortLive with a meaningful message
            $scope.sortLive[parsedSortable] = sortingParams[parsedSortable] === 'asc' ? 'Sorted ascending' : 'Sorted descending';
            // Ensure AngularJS detects the change
            $scope.$applyAsync();

            setTimeout(() => {
                resetSortLive(parsedSortable);		
            }, 2000);
        }
    }

    function resetSortLive(parsedSortable: any) {
        $scope.sortLive = {};
        $scope.$apply();
    }
}