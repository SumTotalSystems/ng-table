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
    sortDesc:any;	
    sortBy($column: IColumnDef, event: IAugmentedMouseEvent): void;
	resetSortDesc($column: IColumnDef) : void;
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
	$scope.resetSortDesc = resetSortDesc;
    
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
			
			$scope.sortDesc = JSON.parse(JSON.stringify(sortingParams));
			
            if(sortingParams[parsedSortable] == 'asc')            
            $scope.sortDesc[parsedSortable] = "Sort " + $column.title() + " in ascending order";
            else if(sortingParams[parsedSortable] == 'desc')
            $scope.sortDesc[parsedSortable] = "Sort " + $column.title() + " in descending order";  					
        }

    }
	
	function resetSortDesc($column: IColumnDef){
		$scope.sortDesc = {};
	}
}