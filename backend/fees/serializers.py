from rest_framework import serializers
from .models import FeeStructure, FeePayment


class FeeStructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeStructure
        fields = '__all__'


class FeePaymentSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    fee_name = serializers.SerializerMethodField()

    class Meta:
        model = FeePayment
        fields = '__all__'
        read_only_fields = ['student']

    def get_student_name(self, obj):
        return obj.student.get_full_name()

    def get_fee_name(self, obj):
        return obj.fee_structure.name
