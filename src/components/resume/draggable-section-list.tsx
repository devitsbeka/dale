'use client';

import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DraggableItem {
    id: string;
    [key: string]: any;
}

interface DraggableSectionListProps<T extends DraggableItem> {
    items: T[];
    onReorder: (items: T[]) => void;
    renderItem: (item: T, isDragging: boolean) => React.ReactNode;
    keyExtractor?: (item: T) => string;
}

export function DraggableSectionList<T extends DraggableItem>({
    items,
    onReorder,
    renderItem,
    keyExtractor = (item) => item.id,
}: DraggableSectionListProps<T>) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px movement required before drag starts
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250, // 250ms hold before drag starts on touch
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => keyExtractor(item) === active.id);
            const newIndex = items.findIndex((item) => keyExtractor(item) === over.id);

            const reorderedItems = arrayMove(items, oldIndex, newIndex);
            onReorder(reorderedItems);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map(keyExtractor)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-4">
                    {items.map((item) => (
                        <SortableItem
                            key={keyExtractor(item)}
                            id={keyExtractor(item)}
                            renderItem={() => renderItem(item, false)}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}

interface SortableItemProps {
    id: string;
    renderItem: () => React.ReactNode;
}

function SortableItem({ id, renderItem }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative">
            <div className="group relative">
                {/* Drag handle */}
                <button
                    type="button"
                    className="absolute -left-8 top-1/2 -translate-y-1/2 cursor-grab rounded p-1 text-tertiary opacity-0 transition hover:bg-secondary/50 hover:text-secondary group-hover:opacity-100 active:cursor-grabbing"
                    {...attributes}
                    {...listeners}
                    aria-label="Drag to reorder"
                >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <circle cx="7" cy="5" r="1" />
                        <circle cx="13" cy="5" r="1" />
                        <circle cx="7" cy="10" r="1" />
                        <circle cx="13" cy="10" r="1" />
                        <circle cx="7" cy="15" r="1" />
                        <circle cx="13" cy="15" r="1" />
                    </svg>
                </button>

                {/* Item content */}
                {renderItem()}
            </div>
        </div>
    );
}
