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
        
    // Sets default sort description to cater for parsed sort orders
    setDefaultSortDescription();

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
            
            $scope.$columns.forEach(function(col){
                if(col.id == $column.id){                    
                    var newDesc = '';
                    if((sorting ? inverseSort : defaultSort) === 'asc'){
                        newDesc = $scope.params.accessibilityOptions('sortDescriptionDesc');
                    }
                    else{
                        newDesc = $scope.params.accessibilityOptions('sortDescriptionAsc');
                    }
                    (<any>col.sortDescription).assign($scope, newDesc);
                }      
                else {
                    (<any>col.sortDescription).assign($scope, $scope.params.accessibilityOptions('sortDescriptionDesc'));
                }                         
            });

            $scope.sortLive = JSON.parse(JSON.stringify(sortingParams));
            
            $scope.sortLive[parsedSortable] = $scope.params.accessibilityOptions('sortedLive');	

            setTimeout(() => {
                resetSortLive(parsedSortable);		
            }, 2000);
        }
    }

    function resetSortLive(parsedSortable: any) {
        $scope.sortLive = {};
        $scope.$apply();
    }
    
    function setDefaultSortDescription() {
        $scope.$columns.forEach(function(col){
            var sortable = col.sortable();
            if (sortable || typeof sortable === 'string') {
                var sortDirection = $scope.params.sorting()[sortable.toString()];
                var desc = '';
                if(sortDirection === 'desc') {
                    desc = $scope.params.accessibilityOptions('sortDescriptionAsc');
                }
                else {
                    desc = $scope.params.accessibilityOptions('sortDescriptionDesc');
                }
                (<any>col.sortDescription).assign($scope, desc);
            }                    
        });
    }
}